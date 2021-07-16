<template>
  <div class="bim-viewer">
    <canvas id="myCanvas" class="canvas" />
    <canvas id="myNavCubeCanvas" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Project, ProjectManager } from "../service/ProjectManager";
import { DatGui } from "./DatGui";
import {
  BCFViewpointsPlugin,
  FastNavPlugin,
  GLTFLoaderPlugin,
  NavCubePlugin,
  Viewer,
} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

@Options({
  props: {
    projectId: String,
  },
})
export default class BimViewer extends Vue {
  projectId!: string;
  project?: Project;
  viewer: any; // eslint-disable-line
  bcfViewpointsPlugin: any; // eslint-disable-line
  fastNavPlugin: any; // eslint-disable-line
  gltfLoader: any; // eslint-disable-line
  navCubePlugin: any; // eslint-disable-line
  loadedModels: any[] = []; // eslint-disable-line
  existingModelIds: string[] = [];
  datGui?: DatGui;

  async mounted(): Promise<void> {
    console.log("[Viewer] component is mounted!");

    const projectId =
      this.projectId || "rac_basic_sample_project"; // TODO: remove the default id
    this.project = await ProjectManager.getProject(projectId);
    if (!this.project) {
      console.warn(`[Viewer] Failed to get project for id: ${projectId}`);
      return;
    }

    const viewer = new Viewer({
      backgroundColor: [0.68, 0.85, 0.9],
      canvasId: "myCanvas",
      pbrEnabled: true,
      preserveDrawingBuffer: true, // This needs to be `true` for {@link Viewer#getSnapshot} to work.
      saoEnabled: true,
      transparent: false,
    });
    this.viewer = viewer;

    const camera = this.project.camera;
    if (camera) {
      viewer.camera.eye = camera.eye;
      viewer.camera.look = camera.look;
      camera.up && (viewer.camera.up = camera.up);
      camera.far && (viewer.camera.far = camera.far);
    } else {
      // set default values if not specified
      // TODO: should dynamically zoom to models...
      viewer.camera.eye = [50, 50, 50];
      viewer.camera.look = [0, 5, 0];
      viewer.camera.up = [0, 1, 0];
      viewer.camera.far = 10000;
    }
    viewer.scene.selectedMaterial.fillAlpha = 0.1;
    viewer.scene.highlightMaterial.fillAlpha = 0.3;
    viewer.scene.highlightMaterial.edgeColor = [1, 1, 0];
    viewer.scene.backgroundColor = [0, 1, 0];
    viewer.cameraControl.followPointer = true;
    // eslint-disable-next-line
    viewer.cameraControl.on("picked", (e: any) => {
      console.log(e.entity.id);
      this.resetScene();
      e.entity.highlighted = true;
    });

    this.bcfViewpointsPlugin = new BCFViewpointsPlugin(viewer);
    this.fastNavPlugin = new FastNavPlugin(viewer, {
      pbrEnabled: true,
      saoEnabled: true,
      edgesEnabled: true,
    });
    viewer.addPlugin(this.bcfViewpointsPlugin);
    viewer.addPlugin(this.fastNavPlugin);
    this.navCubePlugin = new NavCubePlugin(viewer, {
      canvasId: "myNavCubeCanvas",
      visible: true,
      size: 250,
      alignment: "bottomRight",
      bottomMargin: 100,
      rightMargin: 10,
    });

    this.gltfLoader = new GLTFLoaderPlugin(viewer);
    this.loadProjectModels(this.gltfLoader);

    this.initDatGui();
  }

  unmounted() {
    console.log("[Viewer] component is unmounted!");
    this.viewer.destroy();
    this.loadedModels = [];
    this.existingModelIds = [];
  }

  private initDatGui() {
    this.datGui = new DatGui(this.viewer);
    this.datGui.close(); // collapse it by default
  }

  // eslint-disable-next-line
  loadProjectModels(loader: any) {
    if (!this.project) {
      return;
    }
    this.project.models.forEach((model) => {
      if (!model.visible) {
        return; // only load visible ones
      }
      const id = this.getUniqulModelId(model.name);
      console.log(`[Viewer] Loading ${id}...`);
      const startTime = Date.now();
      const m = loader.load({
        id: id,
        src: model.src,
        metaModelSrc: "",
        scale: model.scale,
        rotation: model.rotation,
        edges: model.edges,
      });
      m.on("loaded", () => {
        console.log(
          `[Viewer] loaded ${id} in ${(Date.now() - startTime) / 1000}s`
        );
        this.loadedModels.push(m);
      });
    });
  }

  getUniqulModelId(prefix?: string): string {
    const DEFAULT_PREFIX = "model_id";
    let newId = prefix || `${DEFAULT_PREFIX}_1`;
    let i = 1;
    while (this.existingModelIds.find((id) => id === newId)) {
      newId = prefix ? `${prefix}_${i}` : `${DEFAULT_PREFIX}_${i}`;
      i++;
    }
    this.existingModelIds.push(newId);
    return newId;
  }

  resetScene() {
    const scene = this.viewer.scene;
    scene.setObjectsXRayed(scene.xrayedObjectIds, false);
    scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
    scene.setObjectsSelected(scene.selectedObjectIds, false);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.bim-viewer {
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
    min-height: 750px;
  }
  #myNavCubeCanvas {
    position: absolute;
    width: 200px;
    height: 200px;
    bottom: 10px;
    right: 10px;
    z-index: 200000;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
