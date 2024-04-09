import { BaseNode, PipelineNodeModel } from '@patternfly/react-topology';

class BasePipelineNode extends BaseNode {
  private runAfterTasks?: string[];

  constructor() {
    super();
  }

  setModel(model: PipelineNodeModel): void {
    super.setModel(model);

    if ('runAfterTasks' in model) {
      this.runAfterTasks = model.runAfterTasks;
    }
  };

  toModel(): PipelineNodeModel {
    return {
      ...super.toModel(),
      runAfterTasks: this.runAfterTasks,
      children: super.getAllChildren().map((c) => c.getId())
    };
  }

};

export default BasePipelineNode;
