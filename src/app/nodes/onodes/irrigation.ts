import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Irrigation extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Irrigation', _factory);
		this.name = 'Irrigation';
		this.subtype = 2004;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}