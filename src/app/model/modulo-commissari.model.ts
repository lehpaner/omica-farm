import { IQNode } from '../nodes/model/qnode.model';

export interface IExtendedData {}

export class DatiIniziali implements IExtendedData {
	nome: string;
	cognome: string;
	comunenascita: string;
	datanascita: Date;
	cf: string;
	pec: string;
	constructor() {
		this.nome = '';
		this.cognome = '';
		this.comunenascita = '';
		this.datanascita = new Date();
		this.cf = '';
		this.pec = '';
	}
}

export class SezoniSottosezioni implements IExtendedData {
	sezioneordinaria: boolean;
	sezionespeciale: boolean;
	sezspecialeconsip: boolean;
	sezspecialedirigente: boolean;
	sezspecialeprimario: boolean;
	professioniTechniche: string[];
	settoreSanitario: string[];
	altriServiziEForniture: string[];
}

export class ModuloCommissari implements IQNode {
	id: string;
	owner: string;
	parent: string;
	subtype: number;
	name: string;
    status: number;
    category: number;
    createdOn?: Date;
    modifiedOn?: Date;
	extendedData: IExtendedData;
	children?: ModuloCommissari[];
    constructor() {
		this.name = 'Modulo iscrizione';
		this.subtype = 1000;
		this.status = 10;
		this.children = [];
		this.extendedData = {};
	}
	getChildByType(type: number, create: boolean = true): ModuloCommissari {
		let candidates: ModuloCommissari[] = this.children.filter((uno: ModuloCommissari) => uno.subtype === type);
		if (candidates.length > 0) { return candidates[0]; }
		else if (create) {
			 let child: ModuloCommissari = new ModuloCommissari();
			 child.name = '';
			 child.subtype = type;
			 this.children.push(child);
			 return child;
		}
		return undefined;
	}
}
