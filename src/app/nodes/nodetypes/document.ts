import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Document extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Document', _factory);
		this.name = 'Document';
		this.subtype = 1144;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}