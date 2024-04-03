import { AbstractAnchor, Point, Node } from '@patternfly/react-topology';

export default class TaskGroupSourceAnchor<E extends Node = Node> extends AbstractAnchor {

  constructor(owner: E) {
    super(owner);
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    return new Point(bounds.right(), bounds.y + bounds.height / 2);
  }
}
