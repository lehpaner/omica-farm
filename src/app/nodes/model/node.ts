import { NodeFactory } from  '../services/node-factory.service'
import {IQNode,  IExtendedData, Status } from './qnode.model';

export abstract class Node implements IQNode {
	id: string;
	owner: string;
	parent: string;
	subtype: number;
	name: string;
    status: number;
    category: number;
    createdOn?: Date;
    modifiedOn?: Date;
	extendedData: IExtendedData;
    children?: Node[];
    constructor(name: string, private factory: NodeFactory) {
		this.name = name;
		this.subtype = 1000;
		this.status = 10;
		this.children = [];
		this.extendedData = {};
	}
	public getChildByType(type: number, create: boolean = true): Node {
		let candidates: Node[] = this.children.filter((uno: Node) => uno.subtype === type);
		if (candidates.length > 0) { return candidates[0]; }
		else if (create) {
			 let child: Node = this.factory.getNodeByType(type);
			 child.name = '';
			 child.subtype = type;
			 this.children.push(child);
			 return child;
		}
		return undefined;
	}
}