import axios from "axios";

export interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  camera?: Camera;
  models: Model[];
}

export interface Camera {
  eye: number[];
  look: number[];
  up?: number[];
  far?: number;
}

export interface Model {
  name?: string;
  src: string;
  position?: number[];
  rotation?: number[];
  scale?: number[];
  edges?: boolean; // if we want to generate and show edges to the modle
  visible?: boolean; // default value is true. won't load a model when invisible
}

/**
 * Class for ProjectManager
 */
export class ProjectManager {
  static projects: Project[] = []; // stores online projects

  /**
   * Gets projects
   */
  public static getProjects(): Promise<Project[]> {
    if (this.projects.length > 0) {
      return Promise.resolve(this.projects);
    }
    const baseURL = process.env.BASE_URL;
    const configFile = "config/projects.json";
    return new Promise<Project[]>((resolve, reject) => {
      axios
        .get(configFile, { baseURL })
        .then((res) => {
          const projects = res.data;
          resolve(projects);
        })
        .catch((reason) => {
          console.error(reason);
          reject(reason);
        });
    });
  }

  /**
   * Gets a project
   */
  public static async getProject(id: string): Promise<Project> {
    const projects = await ProjectManager.getProjects();
    const project = projects ? projects.find((p) => p.id === id) : undefined;
    if (!project) {
      return Promise.reject(`Failed to get project with id: ${id}`);
    }
    return Promise.resolve(project);
  }
}
