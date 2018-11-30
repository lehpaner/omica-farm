import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Area extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Area', _factory);
		this.name = 'Area';
		this.subtype = 2001;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
    }
}
