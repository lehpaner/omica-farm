import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Season extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Season', _factory);
		this.name = 'Season';
		this.subtype = 2002;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}