import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Task extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Task', _factory);
		this.name = 'Task';
		this.subtype = 1151;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}