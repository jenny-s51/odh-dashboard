import { AbstractAnchor, Point, Node } from '@patternfly/react-topology';

export default class IconSourceAnchor<E extends Node = Node> extends AbstractAnchor {
  private size: number;

  constructor(owner: E, size: number) {
    super(owner);
    this.size = size;
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    return new Point(bounds.x + this.size, bounds.y + bounds.height / 2);
  }
}
