import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Volume extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Volume', _factory);
		this.name = 'Volume';
		this.subtype = 1142;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}