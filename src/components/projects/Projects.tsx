import { Component, Vue } from "vue-property-decorator";
import { VNode } from "vue/types/umd";
import { ProjectManager, Project } from "@/components/ProjectManager";
import ProjectCard from "./ProjectCard";
import UploadForm from "@/components/upload-form/UploadForm";
import styles from "./Projects.module.scss";
import { deleteProject, createProject, uploadBimFile } from "@/service/project";
import { Message } from "element-ui";

@Component
export default class Projects extends Vue {
  // define a global static variable, so we only need to get demo projects once
  static demoProjects: Project[] = [];
  demoProjects: Project[] = [];
  onLoading = false;
  activateUpdate = false;
  customProjects: Project[] = [];

  async mounted() {
    if (Projects.demoProjects.length === 0) {
      this.onLoading = true;
      ProjectManager.getDemoProjects()
        .then((projects: Project[]) => {
          Projects.demoProjects.push(...projects);
          this.demoProjects = Projects.demoProjects;
        })
        .finally(() => {
          this.onLoading = false;
        });
    } else {
      this.demoProjects = Projects.demoProjects;
    }
  }

  createNewProject() {
    // disable from creating a project for now!
    Message.warning("Not implemented yet!");
    // this.activateUpdate = true
  }

  protected render(): VNode {
    const newProject = {
      name: "<New project>",
      id: "",
    };
    const newProjectCard = (
      <ProjectCard
        project={newProject}
        class={styles.card}
        click={this.createNewProject}
      ></ProjectCard>
    );
    const demoProjectCards = this.demoProjects.map((p) => (
      <ProjectCard
        project={p}
        isDemo={true}
        class={styles.card}
        key={p.id}
      ></ProjectCard>
    ));
    const customProjectCards = this.customProjects.map((p) => (
      <transition name="el-fade-in-linear">
        <ProjectCard
          project={p}
          isDemo={false}
          class={styles.card}
          key={p.id}
          onDelete={() => this.deleteProject(p)}
        ></ProjectCard>
      </transition>
    ));
    return (
      <div ref="projects" class={styles.projects}>
        <el-card class={styles.cardsWrapper}>
          <div slot="header">
            <span class="span e2e-sample-project">Sample projects</span>
          </div>
          {demoProjectCards}
        </el-card>
        <el-divider></el-divider>
        <el-card class={styles.cardsWrapper}>
          <div slot="header">
            <span class="span">My projects</span>
          </div>
          {newProjectCard}
          {customProjectCards}
        </el-card>
        <el-dialog
          class={styles.createDialog}
          title="Create project"
          close-on-click-modal={false}
          on={{
            "update:visible": (val: boolean) => {
              this.activateUpdate = val;
            },
          }}
          visible={this.activateUpdate}
        >
          <UploadForm onSubmit={this.addNewProject} />
        </el-dialog>
      </div>
    );
  }
}
