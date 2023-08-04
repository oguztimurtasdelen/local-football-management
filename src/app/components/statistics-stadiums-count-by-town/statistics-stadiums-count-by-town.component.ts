import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { StatisticsService } from "../../services/global-statistics.service";
import { StatisticsModel } from "../../models/global-statistics.model";
import { statisticsFunctions } from "../../functions/global-statistics.funtion";

import { globalFunctions } from "../../functions/global.function";

@Component({
  selector: 'app-global-statistics-stadiums-count-by-town',
  templateUrl: './statistics-stadiums-count-by-town.component.html',
  styleUrls: ['../../app.component.css', './statistics-stadiums-count-by-town.component.css']
})
export class GlobalStatisticsStadiumsCountByTown implements OnInit, OnDestroy {

  stadiumsCountByTownList: StatisticsModel[] = [];
  private stadiumsCountByTownListSub: Subscription;

  chartOptions: any = this.statisticsFunctions.initChart();

  constructor(
    private statisticsService: StatisticsService,
    private statisticsFunctions: statisticsFunctions,
    private globalFunctions: globalFunctions
  ) {}

  ngOnInit(): void {

    this.statisticsService.getStadiumsCountByTown();
    this.stadiumsCountByTownListSub = this.statisticsService.getStadiumsCountByTownUpdateListener()
      .subscribe({
        next: (data: StatisticsModel[]) => {
          this.stadiumsCountByTownList = data;
          this.chartOptions.title.text = 'İlçelere Göre Saha Sayısı';
          const { seriesArray, labelsArray } = this.statisticsFunctions.separateData(this.stadiumsCountByTownList);
          this.chartOptions.series = seriesArray;

          labelsArray.forEach((item, i) => {
            labelsArray[i] = this.globalFunctions.getTownValue(item);
          });
          this.chartOptions.labels = labelsArray;
        }
      });
  }

  ngOnDestroy(): void {
    this.stadiumsCountByTownListSub.unsubscribe();
  }
}