import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Workspace extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Workspace', _factory);
		this.name = 'Workspace';
		this.subtype = 1142;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}