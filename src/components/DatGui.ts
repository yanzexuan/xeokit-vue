import * as dat from "dat.gui";

export class DatGui {
  viewer?: any; // eslint-disable-line
  gui?: dat.GUI;

  /**
   * dat.gui wrapper class
   */
  constructor (viewer: any) { // eslint-disable-line
    this.viewer = viewer;
    this.init();
  }

  /**
   * Defined all controls here, which will be displyed in dat.GUI
   * Color should follow these formats:
   * '#ffffff', [0, 0, 0], [0, 0, 0, 0.5], { h: 100, s: 0.9, v: 0.3 }
   * While, we need to use it in format of [0, 0, 0, 0.5] here.
   */
  readonly controls = {
    // Viewer settings
    backgroundColor: [0, 0, 0, 1],
    saoEnabled: true,
    pbrEnabled: true,
    edges: true,
  };

  /**
   * Init dat.GUI
   */
  init() {
    if (!this.viewer) {
      throw new Error("Need to initialize viewer first!");
    }
    const viewer = this.viewer;
    // const scene = this.viewer.scene;
    const controls = this.controls;
    this.gui = new dat.GUI({
      name: "controls",
      autoPlace: true,
      width: 300,
      closed: true,
    });
    // uncomment it if we want to save values into localStorage
    // gui.remember(controls)
    // this.gui.close() // collapse the panel by default
    this.gui.domElement.style.opacity = "0.6";

    // Viewer settings folder
    const vsf = this.gui.addFolder("Viewer settings");
    vsf
      .addColor(controls, "backgroundColor")
      .name("backgroundColor")
      .onChange((e: number[]) => {
        console.warn("TODO: not implemented yet!");
        // don't know why the background doesn't update!
        e[0] /= 255.0; // convert to between 0 and 1
        e[1] /= 255.0;
        e[2] /= 255.0;
        viewer.scene.backgroundColor = e;
      });
    vsf
      .add(controls, "saoEnabled")
      .name("saoEnabled")
      .onChange((e: boolean) => {
        console.warn("TODO: not implemented yet!");
        // it works, but when we do operation in canvas, the sao always come back again!
        viewer.scene.sao.enabled = e;
      });
    vsf
      .add(controls, "pbrEnabled")
      .name("pbrEnabled")
      .onChange((e: boolean) => {
        console.warn("TODO: not implemented yet!");
        // it works, but when we do operation in canvas, the pbr always come back again!
        viewer.scene.pbrEnabled = e;
      });
    vsf
      .add(controls, "edges")
      .name("edges")
      .onChange((e: boolean) => {
        // don't know why it doesn't work!
        console.warn("TODO: not implemented yet!");
        viewer.edges = e;
      });
  }

  open() {
    this.gui && this.gui.open();
  }

  close() {
    this.gui && this.gui.close();
  }

  destroy() {
    console.log("TODO");
  }
}
