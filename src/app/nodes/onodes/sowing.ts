import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Sowing extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Sowing', _factory);
		this.name = 'Sowing';
		this.subtype = 2006;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}