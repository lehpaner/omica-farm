import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class TaskList extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('TaskList', _factory);
		this.name = 'TaskList';
		this.subtype = 1150;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}