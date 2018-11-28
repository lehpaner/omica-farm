import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Library extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Library', _factory);
		this.name = 'Library';
		this.subtype = 1141;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}