import { Component, Input, Output, EventEmitter, ViewChild, HostListener, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import moment, { Moment } from 'moment';
import 'moment-timezone'


export declare type UnaryFunction<T, R> = (source: T) => R;

export enum OverviewType { global, year, month, week, day };

export interface CalendarAreaItem {
  date?: Date;
  path?: string;
}

export interface CalendarAreaChangeEvent {
    overview: OverviewType;
    start: Date;
    end: Date;
  }

  export interface CalendarAreaDataSummary {
    name: string;
    value: number;
  }

  export interface CalendarAreaDataDetail extends CalendarAreaItem {
    name: string;
    value: number;
  }
  
  export interface CalendarAreaData extends CalendarAreaItem {
    details?: CalendarAreaDataDetail[];
    summary?: CalendarAreaDataSummary[];
    total: number;
  }

  @Component({
    selector: 'area-calendar',
    template: `<div #root></div>`,
    styles: [`
      :host {
        position: relative;
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
      }
      :host >>> .item {
        cursor: pointer;
      }
      :host >>> .label {
        cursor: pointer;
        fill: rgb(170, 170, 170);
        font-family: Helvetica, arial, 'Open Sans', sans-serif;
      }
      :host >>> .button {
        cursor: pointer;
        fill: transparent;
        stroke-width: 2;
        stroke: rgb(170, 170, 170);
      }
      :host >>> .button text {
        stroke-width: 1;
        text-anchor: middle;
        fill: rgb(170, 170, 170);
      }
      :host >>> .heatmap-tooltip {
        pointer-events: none;
        position: absolute;
        z-index: 9999;
        width: 250px;
        max-width: 250px;
        overflow: hidden;
        padding: 15px;
        font-size: 12px;
        line-height: 14px;
        color: rgb(51, 51, 51);
        font-family: Helvetica, arial, 'Open Sans', sans-serif;
        background: rgba(255, 255, 255, 0.75);
      }
      :host >>> .heatmap-tooltip .header strong {
        display: inline-block;
        width: 250px;
      }
      :host >>> .heatmap-tooltip span {
        display: inline-block;
        width: 50%;
        padding-right: 10px;
        box-sizing: border-box;
      }
      :host >>> .heatmap-tooltip span,
      :host >>> .heatmap-tooltip .header strong {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `],
  })
  export class AreaCalendar {
    @ViewChild('root') element: ElementRef;
  
    @Input() data: CalendarAreaData[] = [];
    @Input() color: string = '#ff4500';
    @Input() overview: OverviewType = OverviewType.global;
  
    /**
    * Helper function to convert seconds to a human readable format
    * @param seconds Integer
    */
    @Input()
    formatTime: UnaryFunction<number, string> = (seconds: number) => {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds - (hours * 3600)) / 60);
      var time = '';
      if (hours > 0) {
        time += hours === 1 ? '1 hour ' : hours + ' hours ';
      }
      if (minutes > 0) {
        time += minutes === 1 ? '1 minute' : minutes + ' minutes';
      }
      if (hours === 0 && minutes === 0) {
        time = Math.round(seconds) + ' seconds';
      }
      return time;
    };
  
    /**
    * Function for project label
    */
    @Input()
    projectLabel: UnaryFunction<string, string> = project => project;
  
    /**
    * Function for year label
    */
    @Input()
    yearLabel: UnaryFunction<Date, string> = date => moment(date).year().toString();
  
    /**
    * Function for month label
    */
    @Input()
    monthLabel: UnaryFunction<Date, string> = date => date.toLocaleDateString('en-us', { month: 'short' });
  
    /**
    * Function for week label
    */
    @Input()
    weekLabel: UnaryFunction<number, string> = number => 'Week ' + number;
  
    /**
    * Function for day of week label
    */
    @Input()
    dayOfWeekLabel: UnaryFunction<Date, string> = date => moment(date).format('dddd')[0];
  
    /**
    * Function for time label
    */
    @Input()
    timeLabel: UnaryFunction<Date, string> = date => moment(date).format('HH:mm');
  
    @Input()
    buildGlobalTooltip: UnaryFunction<CalendarAreaData, string> = (d: CalendarAreaData) => {
      // Construct tooltip
      var tooltip_html = '';
      const isDateFuture: boolean = moment(d.date) > moment();
      tooltip_html += '<div><span><strong>Total time ' + isDateFuture ? 'planned' : 'tracked' + ':</strong></span>';
  
      var sec = d.total;
      var days = Math.floor(sec / 86400);
      if (days > 0) {
        tooltip_html += '<span>' + (days === 1 ? '1 day' : days + ' days') + '</span></div>';
      }
      var hours = Math.floor((sec - (days * 86400)) / 3600);
      if (hours > 0) {
        if (days > 0) {
          tooltip_html += '<div><span></span><span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
        } else {
          tooltip_html += '<span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
        }
      }
      var minutes = Math.floor((sec - (days * 86400) - (hours * 3600)) / 60);
      if (minutes > 0) {
        if (days > 0 || hours > 0) {
          tooltip_html += '<div><span></span><span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
        } else {
          tooltip_html += '<span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
        }
      }
      tooltip_html += '<br />';
  
      // Add summary to the tooltip
      if (d.summary.length <= 5) {
        for (var i = 0; i < d.summary.length; i++) {
          tooltip_html += '<div><span><strong>' + d.summary[i].name + '</strong></span>';
          tooltip_html += '<span>' + this.formatTime(d.summary[i].value) + '</span></div>';
        };
      } else {
        for (var i = 0; i < 5; i++) {
          tooltip_html += '<div><span><strong>' + d.summary[i].name + '</strong></span>';
          tooltip_html += '<span>' + this.formatTime(d.summary[i].value) + '</span></div>';
        };
        tooltip_html += '<br />';
  
        var other_projects_sum = 0;
        for (var i = 5; i < d.summary.length; i++) {
          other_projects_sum = + d.summary[i].value;
        };
        tooltip_html += '<div><span><strong>Other:</strong></span>';
        tooltip_html += '<span>' + this.formatTime(other_projects_sum) + '</span></div>';
      }
  
      return tooltip_html;
    };
  
    @Input()
    buildYearTooltip: UnaryFunction<CalendarAreaData, string> = (d: CalendarAreaData) => {
      // Construct tooltip
      const isDateFuture: boolean = moment(d.date) > moment();
      var tooltip_html = '';
      tooltip_html += '<div class="header"><strong>' + (d.total ? this.formatTime(d.total) : 'No time') + isDateFuture ? 'planned' : 'tracked' + ' </strong></div>';
      tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY') + '</div><br>';
  
      // Add summary to the tooltip
      d.summary.map((d: any) => {
        tooltip_html += '<div><span><strong>' + d.name + '</strong></span>';
        tooltip_html += '<span>' + this.formatTime(d.value) + '</span></div>';
      });
  
      return tooltip_html;
    };
  
    @Input()
    buildMonthTooltip: UnaryFunction<[CalendarAreaDataSummary, Date], string> = (d: [CalendarAreaDataSummary, Date]) => {
      // Construct tooltip
      const isDateFuture: boolean = moment(d[1]) > moment();
      var tooltip_html = '';
      tooltip_html += '<div class="header"><strong>' + d[0].name + '</strong></div><br>';
      tooltip_html += '<div><strong>' + (d[0].value ? this.formatTime(d[0].value) : 'No time') + isDateFuture ? 'planned' : 'tracked' + ' </strong></div>';
      tooltip_html += '<div>on ' + moment(d[1]).format('dddd, MMM Do YYYY') + '</div>';
  
      return tooltip_html;
    };
  
    @Input()
    buildWeekTooltip: UnaryFunction<[CalendarAreaDataSummary, Date], string> = (d: [CalendarAreaDataSummary, Date]) => {
      // Construct tooltip
      const isDateFuture: boolean = moment(d[1]) > moment();
      var tooltip_html = '';
      tooltip_html += '<div class="header"><strong>' + d[0].name + '</strong></div><br>';
      tooltip_html += '<div><strong>' + (d[0].value ? this.formatTime(d[0].value) : 'No time') + isDateFuture ? 'planned' : 'tracked' + ' </strong></div>';
      tooltip_html += '<div>on ' + moment(d[1]).format('dddd, MMM Do YYYY') + '</div>';
  
      return tooltip_html;
    };
  
    @Input()
    buildDayTooltip: UnaryFunction<CalendarAreaDataDetail, string> = (d: CalendarAreaDataDetail) => {
      // Construct tooltip
      const isDateFuture: boolean = moment(d.date) > moment();
      var tooltip_html = '';
      tooltip_html += '<div class="header"><strong>' + d.name + '</strong><div><br>';
      tooltip_html += '<div><strong>' + (d.value ? this.formatTime(d.value) : 'No time') + isDateFuture ? 'planned' : 'tracked' + ' </strong></div>';
      tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY HH:mm') + '</div>';
  
      return tooltip_html;
    };
  
    @Output() handler: EventEmitter<object> = new EventEmitter<object>();
    @Output() onChange: EventEmitter<CalendarAreaChangeEvent> = new EventEmitter<CalendarAreaChangeEvent>();
  
    // Defaults
    private gutter: number = 5;
    private item_gutter: number = 1;
    private width: number = 1000;
    private height: number = 200;
    private item_size: number = 10;
    private label_padding: number = 40;
    private max_block_height: number = 20;
    private transition_duration: number = 500;
    private in_transition: boolean = false;
  
    // Tooltip defaults
    private tooltip_width: number = 250;
    private tooltip_padding: number = 15;
  
    // Overview defaults
    private history: OverviewType[] = [OverviewType.global];
    private selected: CalendarAreaData = {total:0};
  
    // D3 related variables
    private svg: any;
    private items: any;
    private labels: any;
    private buttons: any;
    private tooltip: any;
  
    /**
     * Check if data is available
     */
    ngOnChanges() {
      if (!this.data) { return; }
  
      // Update data summaries
      this.updateDataSummary();
  
      // Draw the chart
      this.drawChart();
    };
  
  
    /**
     * Get hold of the root element and append our svg
     */
    ngAfterViewInit() {
      var element = this.element.nativeElement;
  
      // Initialize svg element
      this.svg = d3.select(element)
        .append('svg')
        .attr('class', 'svg');
  
      // Initialize main svg elements
      this.items = this.svg.append('g');
      this.labels = this.svg.append('g');
      this.buttons = this.svg.append('g');
  
      // Add tooltip to the same element as main svg
      this.tooltip = d3.select(element).append('div')
        .attr('class', 'heatmap-tooltip')
        .style('opacity', 0);
  
      // Calculate chart dimensions
      this.calculateDimensions();
  
      // Draw the chart
      this.drawChart();
    };
  
  
    /**
     * Utility function to get number of complete weeks in a year
     */
    getNumberOfWeeks() {
      var dayIndex = Math.round((+moment() - +moment().subtract(1, 'year').startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      var numWeeks = colIndex + 1;
      return numWeeks;
    };
  
  
    /**
     * Utility funciton to calculate chart dimensions
     */
    calculateDimensions() {
      var element = this.element.nativeElement;
      this.width = element.clientWidth < 1000 ? 1000 : element.clientWidth;
      this.item_size = ((this.width - this.label_padding) / this.getNumberOfWeeks() - this.gutter);
      this.height = this.label_padding + 7 * (this.item_size + this.gutter);
      this.svg.attr('width', this.width).attr('height', this.height);
    };
  
  
    /**
     * Recalculate dimensions on window resize events
     */
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.calculateDimensions();
      if (!!this.data && !!this.data[0] && !!this.data[0].summary) {
        this.drawChart();
      }
    };
  
    /**
     * Helper function to check for data summary
     */
    updateDataSummary() {
      // Get daily summary if that was not provided
      if (this.data[0] && !this.data[0].summary) {
        
        var ss:CalendarAreaData[]  = this.data;
        console.log("UpdateSummaryDataSize:", ss.length);
        console.log("UpdateSummaryData:", ss);
        ss.map((d:CalendarAreaData) => {
          var summary = d.details.reduce((uniques: any, project: any) => {
            if (!uniques[project.name]) {
              uniques[project.name] = {
                'value': project.value
              };
            } else {
              uniques[project.name].value += project.value;
            }
            return uniques;
          }, {});
          var unsorted_summary = Object.keys(summary).map((key) => {
            return {
              'name': key,
              'value': summary[key].value
            };
          });
          d.summary = unsorted_summary.sort((a, b) => {
            return b.value - a.value;
          });
          return d;
        });
      }
    }
  
  
    /**
     * Draw the chart based on the current overview type
     */
    drawChart() {
      if (!this.svg || !this.data || !this.selected) { return; }
      console.log("drawChart:", this.overview);
      this.drawYearOverview();
      this.onChange.emit({
            overview: this.overview,
            start: moment(this.selected.date).startOf('year').toDate(),
            end: moment(this.selected.date).endOf('year').toDate(),
      })
      return;
      switch (this.overview) {
        case OverviewType.global:
          console.log("drawChart: Drawing global");
          this.drawGlobalOverview();
          this.onChange.emit({
            overview: this.overview,
            start: this.data[0].date,
            end: this.data[this.data.length - 1].date,
          })
          break;
        case OverviewType.year:
          console.log("drawChart: Drawing year");
          this.drawYearOverview();
          this.onChange.emit({
            overview: this.overview,
            start: moment(this.selected.date).startOf('year').toDate(),
            end: moment(this.selected.date).endOf('year').toDate(),
          })
          break;
        case OverviewType.month:
          console.log("drawChart: Drawing month");
          this.drawMonthOverview();
          this.onChange.emit({
            overview: this.overview,
            start: moment(this.selected.date).startOf('month').toDate(),
            end: moment(this.selected.date).endOf('month').toDate(),
          })
          break;
        case OverviewType.week:
          console.log("drawChart: Drawing week");
          this.drawWeekOverview();
          this.onChange.emit({
            overview: this.overview,
            start: moment(this.selected.date).startOf('week').toDate(),
            end: moment(this.selected.date).endOf('week').toDate(),
          })
          break;
        case OverviewType.day:
          console.log("drawChart: Drawing day");
          this.drawDayOverview();
          this.onChange.emit({
            overview: this.overview,
            start: moment(this.selected.date).startOf('day').toDate(),
            end: moment(this.selected.date).endOf('day').toDate(),
          })
          break;
        deafult:
          console.log("drawChart: Default year");
          this.drawYearOverview();
          this.onChange.emit({
            overview: this.overview,
            start: moment(this.selected.date).startOf('year').toDate(),
            end: moment(this.selected.date).endOf('year').toDate(),
          })
      }
    };
  
  
    /**
     * Draw global overview (multiple years)
     */
    drawGlobalOverview() {
  
      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }
  
      // Define start and end of the dataset
      var start: any = moment(this.data[0].date).startOf('year');
      var end: any = moment(this.data[this.data.length - 1].date).endOf('year');
  
      // Define array of years and total values
      var data = this.data;
      var year_data = d3.timeYears(start, end).map((d: any) => {
        var date = moment(d);
        return <CalendarAreaData>{
          'date': d,
          'total': data.reduce((prev: number, current: any) => {
            if (moment(current.date).year() === date.year()) {
              prev += current.total;
            }
            return prev;
          }, 0),
          'summary': function () {
            var summary = data.reduce((summary: any, d: any) => {
              if (moment(d.date).year() === date.year()) {
                for (var i = 0; i < d.summary.length; i++) {
                  if (!summary[d.summary[i].name]) {
                    summary[d.summary[i].name] = {
                      'value': d.summary[i].value,
                    };
                  } else {
                    summary[d.summary[i].name].value += d.summary[i].value;
                  }
                }
              }
              return summary;
            }, {});
            var unsorted_summary = Object.keys(summary).map((key) => {
              return {
                'name': key,
                'value': summary[key].value
              };
            });
            return unsorted_summary.sort((a, b) => {
              return b.value - a.value;
            });
          }(),
        };
      });
  
      // Calculate max value of all the years in the dataset
      var max_value = d3.max(year_data, (d: any) => {
        return d.total;
      });
  
      // Define year labels and axis
      var year_labels = d3.timeYears(start, end).map((d: any) => {
        return moment(d);
      });
      var yearScale = d3.scaleBand()
        .rangeRound([0, this.width])
        .padding(0.05)
        .domain(year_labels.map((d: any) => {
          return d.year();
        }));
  
      // Add global data items to the overview
      this.items.selectAll('.item-block-year').remove();
      var item_block = this.items.selectAll('.item-block-year')
        .data(year_data)
        .enter()
        .append('rect')
        .attr('class', 'item item-block-year')
        .attr('width', () => {
          return (this.width - this.label_padding) / year_labels.length - this.gutter * 5;
        })
        .attr('height', () => {
          return this.height - this.label_padding;
        })
        .attr('transform', (d: CalendarAreaData) => {
          return 'translate(' + yearScale(moment(d.date).year().toString()) + ',' + this.tooltip_padding * 2 + ')';
        })
        .attr('fill', (d: CalendarAreaData) => {
          var color = d3.scaleLinear<string>()
            .range(['#ffffff', this.color || '#ff4500'])
            .domain([-0.15 * max_value, max_value]);
          return color(d.total) || '#ff4500';
        })
        .on('click', (ev, d: CalendarAreaData) => {
          if (this.in_transition) { return; }
  
          // Set in_transition flag
          this.in_transition = true;
  
          // Set selected date to the one clicked on
          this.selected = d;
  
          // Hide tooltip
          this.hideTooltip();
  
          // Remove all global overview related items and labels
          this.removeGlobalOverview();
  
          // Redraw the chart
          this.overview = OverviewType.year;
          this.drawChart();
        })
        .style('opacity', 0)
        .on('mouseover', (d: CalendarAreaData) => {
          if (this.in_transition) { return; }
  
          // Construct tooltip
          var tooltip_html = this.buildGlobalTooltip(d);
  
          // Calculate tooltip position
          var x = yearScale(moment(d.date).year().toString()) + this.tooltip_padding * 2;
          while (this.width - x < (this.tooltip_width + this.tooltip_padding * 5)) {
            x -= 10;
          }
          var y = this.tooltip_padding * 4;
  
          // Show tooltip
          this.tooltip.html(tooltip_html)
            .style('left', x + 'px')
            .style('top', y + 'px')
            .transition()
            .duration(this.transition_duration / 2)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('mouseout', () => {
          if (this.in_transition) { return; }
          this.hideTooltip();
        })
        .transition()
        .delay((d: any, i: number) => {
          return this.transition_duration * (i + 1) / 10;
        })
        .duration(() => {
          return this.transition_duration;
        })
        .ease(d3.easeLinear)
        .style('opacity', 1)
        .call((transition: any, callback: any) => {
          if (transition.empty()) {
            callback();
          }
          var n = 0;
          transition
            .each(() => { ++n; })
            .on('end', function () {
              if (!--n) {
                callback.apply(this, arguments);
              }
            });
        }, () => {
          this.in_transition = false;
        });
  
      // Add year labels
      this.labels.selectAll('.label-year').remove();
      this.labels.selectAll('.label-year')
        .data(year_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-year')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: Moment) => this.yearLabel(d.toDate()))
        .attr('x', (d: any) => {
          return yearScale(d.year());
        })
        .attr('y', this.label_padding / 2)
        .on('mouseenter', (ev, year_label: any) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return (moment(d.date).year() === year_label.year()) ? 1 : 0.1;
            });
        })
        .on('mouseout', (ev, d) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('click', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          // Set in_transition flag
          this.in_transition = true;
  
          // Set selected year to the one clicked on
          this.selected = { date: d, total:0 };
  
          // Hide tooltip
          this.hideTooltip();
  
          // Remove all global overview related items and labels
          this.removeGlobalOverview();
  
          // Redraw the chart
          this.overview = OverviewType.year;
          this.drawChart();
        });
    };
  
  
    /**
     * Draw year overview
     */
    drawYearOverview() {
      // Add current overview to the history
      console.log("drawYearOverview:Start");
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }
  
      // Define start and end date of the selected year
      var start_of_year = moment(this.selected.date).startOf('year');
      var end_of_year = moment(this.selected.date).endOf('year');
  
      // Filter data down to the selected year
      var year_data = this.data.filter(d => {
        return start_of_year <= moment(d.date) && moment(d.date) < end_of_year;
      });
  
      // Calculate max value of the year data
      var max_value = d3.max(year_data, (d: any) => {
        return d.total;
      });
  
      var color = d3.scaleLinear<string>()
        .range(['#ffffff', this.color])
        .domain([-0.15 * max_value, max_value]);
  
      this.items.selectAll('.item-circle').remove();
      this.items.selectAll('.item-circle')
        .data(year_data)
        .enter()
        .append('rect')
        .attr('class', 'item item-circle')
        .style('opacity', 0)
        .attr('x', (d: CalendarAreaData) => {
          return this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
        })
        .attr('y', (d: CalendarAreaData) => {
          return this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
        })
        .attr('rx', (d: CalendarAreaData) => {
          return this.calcItemSize(d, max_value);
        })
        .attr('ry', (d: CalendarAreaData) => {
          return this.calcItemSize(d, max_value);
        })
        .attr('width', (d: CalendarAreaData) => {
          return this.calcItemSize(d, max_value);
        })
        .attr('height', (d: CalendarAreaData) => {
          return this.calcItemSize(d, max_value);
        })
        .attr('fill', (d: CalendarAreaData) => {
          return (d.total > 0) ? color(d.total) : 'transparent';
        })
        .on('click', (ev, d: CalendarAreaData) => {
          if (this.in_transition) { return; }
          console.log("CLICK");
          // Don't transition if there is no data to show
          if (d.total === 0) { return; }
  
          this.in_transition = true;
  
          // Set selected date to the one clicked on
          this.selected = d;
  
          // Hide tooltip
          this.hideTooltip();
  
          // Remove all year overview related items and labels
          this.removeYearOverview();
  
          // Redraw the chart
          this.overview = OverviewType.day;
          this.drawChart();
        })
        .on('mouseover', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          // Pulsating animation d3.event.currentTarget
          var circle = d3.select(ev.currentTarget);
          var repeat = () => {
            circle.transition()
              .duration(this.transition_duration)
              .ease(d3.easeLinear)
              .attr('x', (d: CalendarAreaData) => {
                return this.calcItemX(d, start_of_year) - (this.item_size * 1.1 - this.item_size) / 2;
              })
              .attr('y', (d: CalendarAreaData) => {
                return this.calcItemY(d) - (this.item_size * 1.1 - this.item_size) / 2;
              })
              .attr('width', this.item_size * 1.1)
              .attr('height', this.item_size * 1.1)
              .transition()
              .duration(this.transition_duration)
              .ease(d3.easeLinear)
              .attr('x', (d: CalendarAreaData) => {
                return this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
              })
              .attr('y', (d: CalendarAreaData) => {
                return this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
              })
              .attr('width', (d: CalendarAreaData) => {
                return this.calcItemSize(d, max_value);
              })
              .attr('height', (d: CalendarAreaData) => {
                return this.calcItemSize(d, max_value);
              })
              .on('end', repeat);
          };
          repeat();
  
          // Construct tooltip
          var tooltip_html = this.buildYearTooltip(d);
  
          // Calculate tooltip position
          var x = this.calcItemX(d, start_of_year) + this.item_size / 2;
          if (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
            x -= this.tooltip_width + this.tooltip_padding * 2;
          }
          var y = this.calcItemY(d) + this.item_size / 2;
  
          // Show tooltip
          this.tooltip.html(tooltip_html)
            .style('left', x + 'px')
            .style('top', y + 'px')
            .transition()
            .duration(this.transition_duration / 2)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('mouseout', (ev, d:any) => {
          if (this.in_transition) { return; }
  
          // Set circle radius back to what it's supposed to be
          d3.select(ev.currentTarget).transition()
            .duration(this.transition_duration / 2)
            .ease(d3.easeLinear)
            .attr('x', (d: any) => {
              return this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
            })
            .attr('y', (d: any) => {
              return this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
            })
            .attr('width', (d: any) => {
              return this.calcItemSize(d, max_value);
            })
            .attr('height', (d: any) => {
              return this.calcItemSize(d, max_value);
            });
  
          // Hide tooltip
          this.hideTooltip();
        })
        .transition()
        .delay(() => {
          return (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration;
        })
        .duration(() => {
          return this.transition_duration;
        })
        .ease(d3.easeLinear)
        .style('opacity', 1)
        .call((transition: any, callback: any) => {
          if (transition.empty()) {
            callback();
          }
          var n = 0;
          transition
            .each(() => { ++n; })
            .on('end', function () {
              if (!--n) {
                callback.apply(this, arguments);
              }
            });
        }, () => {
          this.in_transition = false;
        });
  
      // Add month labels
      var month_labels = d3.timeMonths(start_of_year.toDate(), end_of_year.toDate());
      var monthScale = d3.scaleLinear()
        .range([0, this.width])
        .domain([0, month_labels.length]);
      this.labels.selectAll('.label-month').remove();
      this.labels.selectAll('.label-month')
        .data(month_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-month')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: Date) => this.monthLabel(d))
        .attr('x', (d: any, i: number) => {
          return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2;
        })
        .attr('y', this.label_padding / 2)
        .on('mouseenter', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          var selected_month = moment(d);
          this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1;
            });
        })
        .on('mouseout', (ev, d) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('click', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          // Check month data
          var month_data = this.data.filter((e: any) => {
            return moment(d).startOf('month') <= moment(e.date) && moment(e.date) < moment(d).endOf('month');
          });
  
          // Don't transition if there is no data to show
          if (!month_data.length) { return; }
  
          // Set selected month to the one clicked on
          this.selected = { date: d, total: 0 };
  
          this.in_transition = true;
  
          // Hide tooltip
          this.hideTooltip();
  
          // Remove all year overview related items and labels
          this.removeYearOverview();
  
          // Redraw the chart
          this.overview = OverviewType.month;
          this.drawChart();
        });
  
      // Add day labels
      var day_labels = d3.timeDays(
        moment().startOf('week').toDate(),
        moment().endOf('week').toDate()
      );
      var dayScale = d3.scaleBand()
        .rangeRound([this.label_padding, this.height])
        .domain(day_labels.map((d: any) => {
          return moment(d).weekday().toString();
        }));
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day')
        .data(day_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-day')
        .attr('x', this.label_padding / 3)
        .attr('y', (d: any, i: number) => {
          return dayScale((i).toString()) + dayScale.bandwidth() / 1.75;
        })
        .style('text-anchor', 'left')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: Date) => this.dayOfWeekLabel(d))
        .on('mouseenter', (event, d: any) => {
          if (this.in_transition) { return; }
  
          var selected_day = moment(d);
          this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
            });
        })
        .on('mouseout', (event, d) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        });
  
      // Add button to switch back to previous overview
      this.drawButton();
    };
  
  
    /**
     * Draw month overview
     */
    drawMonthOverview() {
      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }
  
      // Define beginning and end of the month
      var start_of_month = moment(this.selected.date).startOf('month');
      var end_of_month = moment(this.selected.date).endOf('month');
  
      // Filter data down to the selected month
      var month_data = this.data.filter(d => {
        return start_of_month <= moment(d.date) && moment(d.date) < end_of_month;
      });
      var max_value: number = d3.max(month_data, (d: any) => {
        return d3.max(d.summary, (d: any) => {
          return +d.value;
        });
      });
  
      // Define day labels and axis
      var day_labels = d3.timeDays(moment().startOf('week').toDate(), moment().endOf('week').toDate());
      var dayScale = d3.scaleBand()
        .rangeRound([this.label_padding, this.height])
        .domain(day_labels.map((d: any) => {
          return moment(d).weekday().toString();
        }));
  
      // Define week labels and axis
      var week_labels = [start_of_month.clone()];
      while (start_of_month.week() !== end_of_month.week()) {
        week_labels.push(start_of_month.add(1, 'week').clone());
      }
      var weekScale = d3.scaleBand()
        .rangeRound([this.label_padding, this.width])
        .padding(0.05)
        .domain(week_labels.map((weekday) => {
          return weekday.week().toString();
        }));
  
      // Add month data items to the overview
      this.items.selectAll('.item-block-month').remove();
      var item_block = this.items.selectAll('.item-block-month')
        .data(month_data)
        .enter()
        .append('g')
        .attr('class', 'item item-block-month')
        .attr('width', () => {
          return (this.width - this.label_padding) / week_labels.length - this.gutter * 5;
        })
        .attr('height', () => {
          return Math.min(dayScale.bandwidth(), this.max_block_height);
        })
        .attr('transform', (d: CalendarAreaData) => {
          return 'translate(' + weekScale(moment(d.date).week().toString()) + ',' + ((dayScale(moment(d.date).weekday().toString()) + dayScale.bandwidth() / 1.75) - 15) + ')';
        })
        .attr('total', (d: CalendarAreaData) => {
          return d.total;
        })
        .attr('date', (d: CalendarAreaData) => {
          return d.date;
        })
        .attr('offset', 0)
        .on('click', (d: CalendarAreaData) => {
          if (this.in_transition) { return; }
  
          // Don't transition if there is no data to show
          if (d.total === 0) { return; }
  
          this.in_transition = true;
  
          // Set selected date to the one clicked on
          this.selected = d;
  
          // Hide tooltip
          this.hideTooltip();
  
          // Remove all month overview related items and labels
          this.removeMonthOverview();
  
          // Redraw the chart
          this.overview = OverviewType.day;
          this.drawChart();
        });
  
      var item_width = (this.width - this.label_padding) / week_labels.length - this.gutter * 5;
      var itemScale = d3.scaleLinear()
        .rangeRound([0, item_width]);
  
      var item_gutter = this.item_gutter;
      item_block.selectAll('.item-block-rect')
        .data((d: CalendarAreaData) => {
          return d.summary;
        })
        .enter()
        .append('rect')
        .attr('class', 'item item-block-rect')
        .attr('x', function (d: CalendarAreaDataSummary) {
          var total = parseInt(d3.select(this.parentNode).attr('total'));
          var offset = parseInt(d3.select(this.parentNode).attr('offset'));
          itemScale.domain([0, total]);
          d3.select(this.parentNode).attr('offset', offset + itemScale(d.value));
          return offset;
        })
        .attr('width', function (d: CalendarAreaDataSummary) {
          var total = parseInt(d3.select(this.parentNode).attr('total'));
          itemScale.domain([0, total]);
          return Math.max((itemScale(d.value) - item_gutter), 1)
        })
        .attr('height', () => {
          return Math.min(dayScale.bandwidth(), this.max_block_height);
        })
        .attr('fill', (d: CalendarAreaDataSummary) => {
          var color = d3.scaleLinear<string>()
            .range(['#ffffff', this.color])
            .domain([-0.15 * max_value, max_value]);
          return color(d.value) || '#ff4500';
        })
        .style('opacity', 0)
        .on('mouseover', (ev, d: CalendarAreaDataSummary) => {
          if (this.in_transition) { return; }
  
          // Get date from the parent node
          var date = new Date(d3.select(ev.currentTarget.parentNode).attr('date'));
  
          // Construct tooltip
          var tooltip_html = this.buildMonthTooltip([d, date]);
  
          // Calculate tooltip position
          var x = weekScale(moment(date).week().toString()) + this.tooltip_padding;
          while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
            x -= 10;
          }
          var y = dayScale(moment(date).weekday().toString()) + this.tooltip_padding;
  
          // Show tooltip
          this.tooltip.html(tooltip_html)
            .style('left', x + 'px')
            .style('top', y + 'px')
            .transition()
            .duration(this.transition_duration / 2)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('mouseout', (e, d) => {
          if (this.in_transition) { return; }
          this.hideTooltip();
        })
        .transition()
        .delay(() => {
          return (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration;
        })
        .duration(() => {
          return this.transition_duration;
        })
        .ease(d3.easeLinear)
        .style('opacity', 1)
        .call((transition: any, callback: any) => {
          if (transition.empty()) {
            callback();
          }
          var n = 0;
          transition
            .each(() => { ++n; })
            .on('end', function () {
              if (!--n) {
                callback.apply(this, arguments);
              }
            });
        }, () => {
          this.in_transition = false;
        });
  
      // Add week labels
      this.labels.selectAll('.label-week').remove();
      this.labels.selectAll('.label-week')
        .data(week_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-week')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: Moment) => this.weekLabel(d.week()))
        .attr('x', (d: any) => {
          return weekScale(d.week());
        })
        .attr('y', this.label_padding / 2)
        .on('mouseenter', (e, weekday: any) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            });
        })
        .on('mouseout', (e, d) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('click', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          // Check week data
          var week_data = this.data.filter((e: any) => {
            return d.startOf('week') <= moment(e.date) && moment(e.date) < d.endOf('week');
          });
  
          // Don't transition if there is no data to show
          if (!week_data.length) { return; }
  
          this.in_transition = true;
  
          // Set selected month to the one clicked on
          this.selected = { date: d, total: 0 };
  
          // Hide tooltip
          this.hideTooltip();
  
          // Remove all year overview related items and labels
          this.removeMonthOverview();
  
          // Redraw the chart
          this.overview = OverviewType.week;
          this.drawChart();
        });
  
      // Add day labels
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day')
        .data(day_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-day')
        .attr('x', this.label_padding / 3)
        .attr('y', (d: any, i: any) => {
          return dayScale(i) + dayScale.bandwidth() / 1.75;
        })
        .style('text-anchor', 'left')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: Date) => this.dayOfWeekLabel(d))
        .on('mouseenter', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          var selected_day = moment(d);
          this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
            });
        })
        .on('mouseout', (ev, datum) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        });
  
      // Add button to switch back to previous overview
      this.drawButton();
    };
  
  
    /**
     * Draw week overview
     */
    drawWeekOverview() {
      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }
  
      // Define beginning and end of the week
      var start_of_week = moment(this.selected.date).startOf('week');
      var end_of_week = moment(this.selected.date).endOf('week');
  
      // Filter data down to the selected week
      var week_data = this.data.filter(d => {
        return start_of_week <= moment(d.date) && moment(d.date) < end_of_week;
      });
      var max_value: number = d3.max(week_data, (d: any) => {
        return d3.max(d.summary, (d: any) => {
          return +d.value;
        });
      });
  
      // Define day labels and axis
      var day_labels = d3.timeDays(moment().startOf('week').toDate(), moment().endOf('week').toDate());
      var dayScale = d3.scaleBand()
        .rangeRound([this.label_padding, this.height])
        .domain(day_labels.map((d: any) => {
          return moment(d).weekday().toString();
        }));
  
      // Define week labels and axis
      var week_labels = [start_of_week];
      var weekScale = d3.scaleBand()
        .rangeRound([this.label_padding, this.width])
        .padding(0.01)
        .domain(week_labels.map((weekday: any) => {
          return weekday.week();
        }));
  
      // Add week data items to the overview
      this.items.selectAll('.item-block-week').remove();
      var item_block = this.items.selectAll('.item-block-week')
        .data(week_data)
        .enter()
        .append('g')
        .attr('class', 'item item-block-week')
        .attr('width', () => {
          return (this.width - this.label_padding) / week_labels.length - this.gutter * 5;
        })
        .attr('height', () => {
          return Math.min(dayScale.bandwidth(), this.max_block_height);
        })
        .attr('transform', (d: CalendarAreaData) => {
          return 'translate(' + weekScale(moment(d.date).week().toString()) + ',' + ((dayScale(moment(d.date).weekday().toString()) + dayScale.bandwidth() / 1.75) - 15) + ')';
        })
        .attr('total', (d: CalendarAreaData) => {
          return d.total;
        })
        .attr('date', (d: CalendarAreaData) => {
          return d.date;
        })
        .attr('offset', 0)
        .on('click', (d: CalendarAreaData) => {
          if (this.in_transition) { return; }
  
          // Don't transition if there is no data to show
          if (d.total === 0) { return; }
  
          this.in_transition = true;
  
          // Set selected date to the one clicked on
          this.selected = d;
  
          // Hide tooltip
          this.hideTooltip();
  
          // Remove all week overview related items and labels
          this.removeWeekOverview();
  
          // Redraw the chart
          this.overview = OverviewType.day;
          this.drawChart();
        });
  
      var item_width = (this.width - this.label_padding) / week_labels.length - this.gutter * 5;
      var itemScale = d3.scaleLinear()
        .rangeRound([0, item_width]);
  
      var item_gutter = this.item_gutter;
      item_block.selectAll('.item-block-rect')
        .data((d: CalendarAreaData) => {
          return d.summary;
        })
        .enter()
        .append('rect')
        .attr('class', 'item item-block-rect')
        .attr('x', function (d: CalendarAreaDataSummary) {
          var total = parseInt(d3.select(this.parentNode).attr('total'));
          var offset = parseInt(d3.select(this.parentNode).attr('offset'));
          itemScale.domain([0, total]);
          d3.select(this.parentNode).attr('offset', offset + itemScale(d.value));
          return offset;
        })
        .attr('width', function (d: CalendarAreaDataSummary) {
          var total = parseInt(d3.select(this.parentNode).attr('total'));
          itemScale.domain([0, total]);
          return Math.max((itemScale(d.value) - item_gutter), 1)
        })
        .attr('height', () => {
          return Math.min(dayScale.bandwidth(), this.max_block_height);
        })
        .attr('fill', (d: CalendarAreaDataSummary) => {
          var color = d3.scaleLinear<string>()
            .range(['#ffffff', this.color])
            .domain([-0.15 * max_value, max_value]);
          return color(d.value) || '#ff4500';
        })
        .style('opacity', 0)
        .on('mouseover', (ev, d: CalendarAreaDataSummary) => {
          if (this.in_transition) { return; }
  
          // Get date from the parent node
          var date = new Date(d3.select(ev.currentTarget.parentNode).attr('date'));
  
          // Construct tooltip
          var tooltip_html = this.buildWeekTooltip([d, date]);
  
          // Calculate tooltip position
          var total = parseInt(d3.select(ev.currentTarget.parentNode).attr('total'));
          itemScale.domain([0, total]);
          var x = parseInt(d3.select(ev.currentTarget).attr('x')) + this.tooltip_padding * 5;
          while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
            x -= 10;
          }
          var y = dayScale(moment(date).weekday().toString()) + this.tooltip_padding;
  
          // Show tooltip
          this.tooltip.html(tooltip_html)
            .style('left', x + 'px')
            .style('top', y + 'px')
            .transition()
            .duration(this.transition_duration / 2)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('mouseout', (ev, datum) => {
          if (this.in_transition) { return; }
          this.hideTooltip();
        })
        .transition()
        .delay(() => {
          return (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration;
        })
        .duration(() => {
          return this.transition_duration;
        })
        .ease(d3.easeLinear)
        .style('opacity', 1)
        .call((transition: any, callback: any) => {
          if (transition.empty()) {
            callback();
          }
          var n = 0;
          transition
            .each(() => { ++n; })
            .on('end', function () {
              if (!--n) {
                callback.apply(this, arguments);
              }
            });
        }, () => {
          this.in_transition = false;
        });
  
      // Add week labels
      this.labels.selectAll('.label-week').remove();
      this.labels.selectAll('.label-week')
        .data(week_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-week')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: any) => this.weekLabel(d.week()))
        .attr('x', (d: any) => {
          return weekScale(d.week());
        })
        .attr('y', this.label_padding / 2)
        .on('mouseenter', (ev, weekday: any) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            });
        })
        .on('mouseout', (ev, datum) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        });
  
      // Add day labels
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-day')
        .data(day_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-day')
        .attr('x', this.label_padding / 3)
        .attr('y', (d: any, i: number) => {
          return dayScale((i).toString()) + dayScale.bandwidth() / 1.75;
        })
        .style('text-anchor', 'left')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: Date) => this.dayOfWeekLabel(d))
        .on('mouseenter', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          var selected_day = moment(d);
          this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
            });
        })
        .on('mouseout', (ev, datum) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        });
  
      // Add button to switch back to previous overview
      this.drawButton();
    };
  
  
    /**
     * Draw day overview
     */
    drawDayOverview() {
      // Add current overview to the history
      if (this.history[this.history.length - 1] !== this.overview) {
        this.history.push(this.overview);
      }
  
      // Initialize selected date to today if it was not set
      if (!Object.keys(this.selected).length) {
        this.selected = this.data[this.data.length - 1];
      }
  
      var project_labels = this.selected.summary.map(project => project.name);
      var projectScale = d3.scaleBand()
        .rangeRound([this.label_padding, this.height])
        .domain(project_labels);
  
      var itemScale = d3.scaleTime()
        .range([this.label_padding * 2, this.width])
        .domain([moment(this.selected.date).startOf('day'), moment(this.selected.date).endOf('day')]);
      this.items.selectAll('.item-block').remove();
      this.items.selectAll('.item-block')
        .data(this.selected.details)
        .enter()
        .append('rect')
        .attr('class', 'item item-block')
        .attr('x', (d: CalendarAreaDataDetail) => {
          return itemScale(moment(d.date));
        })
        .attr('y', (d: CalendarAreaDataDetail) => {
          return (projectScale(d.name) + projectScale.bandwidth() / 2) - 15;
        })
        .attr('width', (d: CalendarAreaDataDetail) => {
          var end = itemScale(d3.timeSecond.offset(moment(d.date).toDate(), d.value));
          return Math.max((end - itemScale(moment(d.date))), 1);
        })
        .attr('height', () => {
          return Math.min(projectScale.bandwidth(), this.max_block_height);
        })
        .attr('fill', () => {
          return this.color;
        })
        .style('opacity', 0)
        .on('mouseover', (ev, d: CalendarAreaDataDetail) => {
          if (this.in_transition) { return; }
  
          // Construct tooltip
          var tooltip_html = this.buildDayTooltip(d);
  
          // Calculate tooltip position
          var x = d.value * 100 / (60 * 60 * 24) + itemScale(moment(d.date));
          while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
            x -= 10;
          }
          var y = projectScale(d.name) + this.tooltip_padding;
  
          // Show tooltip
          this.tooltip.html(tooltip_html)
            .style('left', x + 'px')
            .style('top', y + 'px')
            .transition()
            .duration(this.transition_duration / 2)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        })
        .on('mouseout', (ev, datum) => {
          if (this.in_transition) { return; }
          this.hideTooltip();
        })
        .on('click', (ev, d: any) => {
          if (this.handler) {
            this.handler.emit(d);
          }
        })
        .transition()
        .delay(() => {
          return (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration;
        })
        .duration(() => {
          return this.transition_duration;
        })
        .ease(d3.easeLinear)
        .style('opacity', 0.5)
        .call((transition: any, callback: any) => {
          if (transition.empty()) {
            callback();
          }
          var n = 0;
          transition
            .each(() => { ++n; })
            .on('end', function () {
              if (!--n) {
                callback.apply(this, arguments);
              }
            });
        }, () => {
          this.in_transition = false;
        });
  
      // Add time labels
      var timeLabels = d3.timeHours(
        moment(this.selected.date).startOf('day').toDate(),
        moment(this.selected.date).endOf('day').toDate()
      );
      var timeScale = d3.scaleTime()
        .range([this.label_padding * 2, this.width])
        .domain([0, timeLabels.length]);
      this.labels.selectAll('.label-time').remove();
      this.labels.selectAll('.label-time')
        .data(timeLabels)
        .enter()
        .append('text')
        .attr('class', 'label label-time')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: Date) => this.timeLabel(d))
        .attr('x', (d: any, i: number) => {
          return timeScale(i);
        })
        .attr('y', this.label_padding / 2)
        .on('mouseenter', (ev, d: any) => {
          if (this.in_transition) { return; }
  
          var selected = itemScale(moment(d));
          this.items.selectAll('.item-block')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              var start = itemScale(moment(d.date));
              var end = itemScale(moment(d.date).add(d.value, 'seconds'));
              return (selected >= start && selected <= end) ? 1 : 0.1;
            });
        })
        .on('mouseout', (ev, datum) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 0.5);
        });
  
      // Add project labels
      var label_padding = this.label_padding;
      this.labels.selectAll('.label-project').remove();
      this.labels.selectAll('.label-project')
        .data(project_labels)
        .enter()
        .append('text')
        .attr('class', 'label label-project')
        .attr('x', this.gutter)
        .attr('y', (d: any) => {
          return projectScale(d) + projectScale.bandwidth() / 2;
        })
        .attr('min-height', () => {
          return projectScale.bandwidth();
        })
        .style('text-anchor', 'left')
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .text((d: string) => this.projectLabel(d))
        .each(function (d: any, i: number) {
          var obj = d3.select(this),
            text_length = obj.node().getComputedTextLength(),
            text = obj.text();
          while (text_length > (label_padding * 1.5) && text.length > 0) {
            text = text.slice(0, -1);
            obj.text(text + '...');
            text_length = obj.node().getComputedTextLength();
          }
        })
        .on('mouseenter', (ev, project: any) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', (d: any) => {
              return (d.name === project) ? 1 : 0.1;
            });
        })
        .on('mouseout', (ev, datum) => {
          if (this.in_transition) { return; }
  
          this.items.selectAll('.item-block')
            .transition()
            .duration(this.transition_duration)
            .ease(d3.easeLinear)
            .style('opacity', 0.5);
        });
  
      // Add button to switch back to previous overview
      this.drawButton();
    };
  
  
    /**
     * Helper function to calculate item position on the x-axis
     * @param d object
     */
    calcItemX(d: CalendarAreaItem, start_of_year: any) {
      var date = moment(d.date);
      var dayIndex = Math.round((+date - +moment(start_of_year).startOf('week')) / 86400000);
      var colIndex = Math.trunc(dayIndex / 7);
      return colIndex * (this.item_size + this.gutter) + this.label_padding;
    };
  
  
    /**
     * Helper function to calculate item position on the y-axis
     * @param d object
     */
    calcItemY(d: CalendarAreaItem) {
      return this.label_padding + moment(d.date).weekday() * (this.item_size + this.gutter);
    };
  
  
    /**
     * Helper function to calculate item size
     * @param d object
     * @param max number
     */
    calcItemSize(d: CalendarAreaData, max: number) {
      if (max <= 0) { return this.item_size; }
      return this.item_size * 0.75 + (this.item_size * d.total / max) * 0.25;
    };
  
  
    /**
     * Draw the button for navigation purposes
     */
    drawButton() {
      this.buttons.selectAll('.button').remove();
      var button = this.buttons.append('g')
        .attr('class', 'button button-back')
        .style('opacity', 0)
        .on('click', (ev, datum) => {
          if (this.in_transition) { return; }
  
          // Set transition boolean
          this.in_transition = true;
  
          // Clean the canvas from whichever overview type was on
          switch (this.overview) {
            case OverviewType.year:
              this.removeYearOverview();
              break;
            case OverviewType.month:
              this.removeMonthOverview();
              break;
            case OverviewType.week:
              this.removeWeekOverview();
              break;
            case OverviewType.day:
              this.removeDayOverview();
              break;
          }
  
          // Redraw the chart
          this.history.pop();
          this.overview = this.history.pop();
          this.drawChart();
        });
      button.append('circle')
        .attr('cx', this.label_padding / 2.25)
        .attr('cy', this.label_padding / 2.5)
        .attr('r', this.item_size / 2);
      button.append('text')
        .attr('x', this.label_padding / 2.25)
        .attr('y', this.label_padding / 2.5)
        .attr('dy', () => {
          return Math.floor(this.width / 100) / 3;
        })
        .attr('font-size', () => {
          return Math.floor(this.label_padding / 3) + 'px';
        })
        .html('&#x2190;');
      button.transition()
        .duration(this.transition_duration)
        .ease(d3.easeLinear)
        .style('opacity', 1);
    };
  
  
    /**
     * Transition and remove items and labels related to global overview
     */
    removeGlobalOverview() {
      this.items.selectAll('.item-block-year')
        .transition()
        .duration(this.transition_duration)
        .ease(d3.easeLinear)
        .style('opacity', 0)
        .remove();
      this.labels.selectAll('.label-year').remove();
    };
  
  
    /**
     * Transition and remove items and labels related to year overview
     */
    removeYearOverview() {
      this.items.selectAll('.item-circle')
        .transition()
        .duration(this.transition_duration)
        .ease(d3.easeLinear)
        .style('opacity', 0)
        .remove();
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-month').remove();
      this.hideBackButton();
    };
  
  
    /**
     * Transition and remove items and labels related to month overview
     */
    removeMonthOverview() {
      this.items.selectAll('.item-block-month').selectAll('.item-block-rect')
        .transition()
        .duration(this.transition_duration)
        .ease(d3.easeLinear)
        .style('opacity', 0)
        .attr('x', (d: any, i: number) => {
          return (i % 2 === 0) ? -this.width / 3 : this.width / 3;
        })
        .remove();
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-week').remove();
      this.hideBackButton();
    };
  
  
    /**
     * Transition and remove items and labels related to week overview
     */
    removeWeekOverview() {
      this.items.selectAll('.item-block-week').selectAll('.item-block-rect')
        .transition()
        .duration(this.transition_duration)
        .ease(d3.easeLinear)
        .style('opacity', 0)
        .attr('x', (d: any, i: number) => {
          return (i % 2 === 0) ? -this.width / 3 : this.width / 3;
        })
        .remove();
      this.labels.selectAll('.label-day').remove();
      this.labels.selectAll('.label-week').remove();
      this.hideBackButton();
    };
  
  
    /**
     * Transition and remove items and labels related to daily overview
     */
    removeDayOverview() {
      this.items.selectAll('.item-block')
        .transition()
        .duration(this.transition_duration)
        .ease(d3.easeLinear)
        .style('opacity', 0)
        .attr('x', (d: any, i: number) => {
          return (i % 2 === 0) ? -this.width / 3 : this.width / 3;
        })
        .remove();
      this.labels.selectAll('.label-time').remove();
      this.labels.selectAll('.label-project').remove();
      this.hideBackButton();
    };
  
  
    /**
     * Helper function to hide the tooltip
     */
    hideTooltip() {
      this.tooltip.transition()
        .duration(this.transition_duration / 2)
        .ease(d3.easeLinear)
        .style('opacity', 0);
    };
  
  
    /**
     * Helper function to hide the back button
     */
    hideBackButton() {
      this.buttons.selectAll('.button')
        .transition()
        .duration(this.transition_duration)
        .ease(d3.easeLinear)
        .style('opacity', 0)
        .remove();
    };
  
  }