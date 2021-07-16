import { Component } from "vue-property-decorator";
import { Options, Vue, Prop, Emit } from "vue-class-component";
import { VNode } from "vue/types/umd";
import { Project } from "@/components/ProjectManager";
import styles from "./ProjectCard.module.scss";

export interface ProjectCardProps {
  project: Project;
  isDemo?: boolean;
  click?: (project: Project) => void;
}

@Component
export default class ProjectCard extends Vue {
  @Prop({ required: true }) project!: ProjectCardProps["project"];
  @Prop({ required: false }) isDemo!: ProjectCardProps["isDemo"];
  @Prop({ required: false }) click?: ProjectCardProps["click"];

  @Emit()
  delete(e: MouseEvent) {
    e.stopPropagation();
  }

  readonly defaultThumbnail = "images/default-thumbnail.jpg";

  mounted() {
    const div = this.$refs.thumbnail as HTMLDivElement;
    if (this.project.thumbnail) {
      div.style.backgroundImage = `url(${this.project.thumbnail})`;
    }
  }

  openProject(project: Project, isDemo = false) {
    return () => {
      console.log(`Routing to project: ${project.name}, id: ${project.id}`);
      this.$router.push(
        `/projects/${project.id}${isDemo ? "?isDemo=true" : ""}`
      );
    };
  }

  protected render(): VNode {
    return (
      <div
        ref="projectCard"
        class={styles.projectCard}
        onClick={this.click || this.openProject(this.project, this.isDemo)}
      >
        <div class={styles.card}>
          <div ref="thumbnail" class={styles.thumbnail}>
            {!this.isDemo && this.project.id && (
              <el-button
                type="text"
                icon="el-icon-delete"
                class={styles.deleteBtn}
                onClick={(e: MouseEvent) => this.delete(e)}
              ></el-button>
            )}
          </div>
          <div class={styles.infos}>
            <div class={styles.info}>{`项目名称：${this.project.name}`}</div>
            <div class={styles.info}>{`${this.project.id && "项目id："} ${
              this.project.id
            }`}</div>
          </div>
        </div>
      </div>
    );
  }
}
