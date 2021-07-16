import { Component, Vue, Prop } from "vue-property-decorator";
import { VNode } from "vue/types/umd";
import styles from "./projectPanel.module.scss";
import Viewer3DContainer from "../viewer-container/Viewer3DContainer";

export interface ProjectPanelProps {}

@Component
export default class ProjectPanel extends Vue {
  projectId?: string;
  isDemo?: boolean;

  mounted() {}

  getProjectId() {
    this.projectId = this.$router.currentRoute.params.projectId;
    this.isDemo = this.$router.currentRoute.query.isDemo === "true";
    if (!this.projectId) {
      console.error("Invalid projectId!");
      return;
    }
    return this.projectId;
  }

  protected render(): VNode {
    return (
      <div ref="projectPanel" class={styles.projectPanel}>
        <Viewer3DContainer
          projectId={this.getProjectId()}
          isDemo={this.isDemo}
        ></Viewer3DContainer>
      </div>
    );
  }
}
