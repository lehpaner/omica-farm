import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Folder extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Folder', _factory);
		this.name = 'Folder';
		this.subtype = 1144;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}