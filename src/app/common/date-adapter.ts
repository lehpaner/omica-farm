import { NativeDateAdapter } from '@angular/material' ;
import { Injectable } from '@angular/core';

@Injectable()
export class AnacDateAdapter extends NativeDateAdapter {

    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            const day: number = date.getDate();
            const month: number = date.getMonth() + 1;
            const year: number = date.getFullYear();
            return `${day}/${month}/${year}`;
        } else {
            return date.toDateString();
        }
    }
}

export const ANAC_DATE_FORMATS = {
    parse: {

        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'numeric' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};