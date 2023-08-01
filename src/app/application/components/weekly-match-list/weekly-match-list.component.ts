import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { SeasonsModel } from "../../models/application-seasons.model";
import { SeasonsService } from "../../services/application-seasons.service";

import { WeeklyMatchProgramModel } from "../../models/application-weeklymatchprogram.model";
import { WeeklyMatchProgramService } from "../../services/application-weeklymatchprogram.service";

import { WeeklyMatchListModel } from "../../models/application-weeklymatchlist.model";
import { WeeklyMatchListService } from "../../services/application-weeklymatchlist.service";

import { FixtureModel } from "../../models/application-fixture.model";
import { FixtureService } from "../../services/application-fixtures.service";
import { FixtureSearchModel } from "../../models/application-fixture-search-index.model";

import { globalFunctions } from "../../../functions/global.function";
import { fixtureFunctions } from "../../functions/fixture.function";

import { matchStatusList } from "../../../assets/lists/match-status.list";
import { townList } from "../../../assets/lists/town-izmir.list";
import { fontAwesomeIconList } from "../../../assets/lists/font-awesome-icon.list";


@Component({
  selector: 'app-application-weeklymatch-list',
  templateUrl: './weekly-match-list.component.html',
  styleUrls: ['../../../app.component.css', './weekly-match-list.component.css']
})
export class ApplicationWeeklyMatchList implements OnInit, OnDestroy {
  toolbarTitle = "HAFTALIK BÜLTEN";
  isLoading: boolean = false;

  seasonsList: SeasonsModel[] = [];
  private seasonsListSubscription: Subscription;
  weeklyMatchProgramList: WeeklyMatchProgramModel[] = [];
  private weeklyMatchProgramListSubscription: Subscription;
  weeklyMatchList: WeeklyMatchListModel[] = [];
  private weeklyMatchListSubscription: Subscription;
  fixtureList: FixtureModel[] = [];
  private fixtureListSub: Subscription;

  fontAwesomeIconList = fontAwesomeIconList;
  matchStatusList: Array<any> = matchStatusList;
  townList: Array<any> = townList;

  @Input() seasonSelectionId: number;

  filterSeasonList: Array<string> = [];
  @Input() filterSeasonSelectionValue: string = null;
  filterLeagueList: Array<string> = [];
  @Input() filterLeagueSelectionValue: string = null;
  filterGroupstageList: Array<string> = [];
  @Input() filterGroupstageSelectionValue: string = null;
  filterTeamList: Array<string> = [];
  @Input() filterTeamSelectionValue: string = null;
  filterTownList: Array<string> = [];
  @Input() filterTownSelectionValue: string = null;
  filterStadiumList: Array<string> = [];
  @Input() filterStadiumSelectionValue: string = null;
  filterDateList: Array<string> = [];
  @Input() filterDateSelectionValue: string = null;

  filteredFixtureList: FixtureModel[] = [];

  tableColumns: string[] = [
                            "homeTeam",
                            "details",
                            "awayTeam",
                          ];

  constructor(
    private seasonsService: SeasonsService,
    private weeklymatchprogramService: WeeklyMatchProgramService,
    private weeklymatchlistService : WeeklyMatchListService,
    private fixtureService: FixtureService,
    private globalFunctions: globalFunctions,
    private fixtureFunctions: fixtureFunctions
  ) {}

  ngOnInit(): void {
    this.globalFunctions.setToolbarTitle(this.toolbarTitle);
    this.seasonsService.getSeasons();
    this.seasonsListSubscription = this.seasonsService.getSeasonsListUpdateListener()
      .subscribe({
        next: (data: SeasonsModel[]) => {
          this.seasonsList = data;
          this.seasonSelectionId = this.seasonsList[0]["id"];
          this.weeklymatchprogramService.getWeeklyMatchProgram(this.seasonSelectionId);
          //this.weeklymatchlistService.getWeeklyMatchList(this.seasonSelectionId);
        },
        error: (error) => {

        }
      });

    this.weeklyMatchProgramListSubscription = this.weeklymatchprogramService.getDocumentsListUpdateListener()
      .subscribe({
        next: (data: WeeklyMatchProgramModel[]) => {
          this.weeklyMatchProgramList = data;
          let _weeklyMatchProgramIds: Array<number> = [];
          this.weeklyMatchProgramList.forEach(wmpl => {
            _weeklyMatchProgramIds.push(wmpl.id);
          });

          this.weeklymatchlistService.getWeeklyMatchList(this.seasonSelectionId);
          this.onSearchFixture(_weeklyMatchProgramIds);
        },
        error: (error) => {

        }
      });

    this.weeklyMatchListSubscription = this.weeklymatchlistService.getWeeklyMatchListUpdateListener()
      .subscribe({
        next: (data: WeeklyMatchListModel[]) => {
          this.weeklyMatchList = data;
        },
        error: (error) => {

        }
      });

    this.fixtureListSub = this.fixtureService.getFixtureUpdateListener()
      .subscribe({
        next: (data: FixtureModel[]) => {
          this.fixtureList = data.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

          this.filterSeasonList = this.getDistinctSeasonName(this.fixtureList);
          this.filterLeagueList = this.getDistinctLeagueName(this.fixtureList);
          this.filterGroupstageList = this.getDistinctGroupstageName(this.fixtureList);
          this.filterTeamList = this.getDistinctTeamName(this.fixtureList);
          this.filterTownList = this.getDistinctTownName(this.fixtureList);
          this.filterStadiumList = this.getDistinctStadiumName(this.fixtureList);
          this.filterDateList = this.getDistinctMatchDate(this.fixtureList);

          this.onSearch();
        },
        error: (error) => {

        }
      });

  }

  onSearchFixture(weeklyMatchProgramIds: Array<number>) {
    let fixtureSearchModel = this.fixtureFunctions.setFixtureSearchModel(
      this.seasonSelectionId,
      null, null, null, null, null, null, null, null, null, null, null,
      weeklyMatchProgramIds
    );

    this.fixtureService.getFixtureBySearchIndex(fixtureSearchModel);
  }

  getMatchDate(_date: Date): string {
    const longDate = this.getLocalDateForLongDate(_date);
    const shortTime = this.getLocalDateForShortTime(_date);
    const formattedDate = (longDate || shortTime) ? (longDate + " " + shortTime) : null;
    return formattedDate;
  }

  getLocalDateForLongDate(_date: Date): string {
    return this.globalFunctions.registerLocalDateForLongDate(_date);
  }

  getLocalDateForShortTime(_date: Date): string {
    return this.globalFunctions.registerLocalDateForShortTime(_date);
  }

  findMatchStatus(status: string): string {
    return this.matchStatusList.find(s => s.name == status).value;
  }

  findMatchStatusClass(status: string): string {
    return this.matchStatusList.find(s => s.name == status).class;
  }

  getDistinctSeasonName(fixtureList: FixtureModel[]): Array<string> {
    const distinctSeasonName = [...new Set(fixtureList.map(f => f.seasonName))].filter(f => f !== null);
    return distinctSeasonName;
  }

  getDistinctLeagueName(fixtureList: FixtureModel[]): Array<string> {
    const distinctLeagueName = [...new Set(fixtureList.map(f => f.leagueName))].filter(f => f !== null);
    return distinctLeagueName;
  }

  getDistinctGroupstageName(fixtureList: FixtureModel[]): Array<string> {
    const distinctGroupstageName = [...new Set(fixtureList.map(f => f.groupstageName))].filter(f => f !== null);
    return distinctGroupstageName;
  }

  getDistinctTeamName(fixtureList: FixtureModel[]): Array<string> {
    const mergedTeamName = [...new Set(fixtureList.map(f => f.homeTeamOfficialName)), ...new Set(fixtureList.map(f => f.awayTeamOfficialName))];
    const distinctTeamName = [...new Set(mergedTeamName.map(t => t))].sort((a, b) => a.localeCompare(b)).filter(t => t !== null);
    return distinctTeamName;
  }

  getDistinctTownName(fixtureList: FixtureModel[]): Array<string> {
    const distinctTownName = [...new Set(fixtureList.map(f => f.stadiumTown))].filter(f => f !== null);
    return distinctTownName;
  }

  getDistinctStadiumName(fixtureList: FixtureModel[]): Array<string> {
    const distinctStadiumName = [...new Set(fixtureList.map(f => f.stadiumName))].filter(f => f !== null);
    return distinctStadiumName;
  }

  getDistinctMatchDate(fixtureList: FixtureModel[]): Array<string> {
    const distinctMatchDate = [...new Set(fixtureList.map(f => this.getLocalDateForLongDate(f.matchDate)))].filter(f => f !== null);
    return distinctMatchDate;
  }

  findTownName(town: string): string {
    return this.townList.find(t => t.name == town).value;
  }

  onSearch() {
    let _filteredFixtureList: FixtureModel[] = [];

    _filteredFixtureList = this.fixtureList.filter(f =>
      f.leagueName == (this.filterLeagueSelectionValue || f.leagueName) &&
      f.groupstageName == (this.filterGroupstageSelectionValue || f.groupstageName) &&
      (f.homeTeamOfficialName == (this.filterTeamSelectionValue || f.homeTeamOfficialName) ||
      f.awayTeamOfficialName == (this.filterTeamSelectionValue || f.awayTeamOfficialName)) &&
      f.stadiumTown == (this.filterTownSelectionValue || f.stadiumTown) &&
      f.stadiumName == (this.filterStadiumSelectionValue || f.stadiumName) &&
      this.getLocalDateForLongDate(f.matchDate) == (this.filterDateSelectionValue || this.getLocalDateForLongDate(f.matchDate))
    );

    this.filteredFixtureList = _filteredFixtureList;
  }

  onExport() {

  }

  ngOnDestroy(): void {
    this.seasonsListSubscription.unsubscribe();
    this.weeklyMatchProgramListSubscription.unsubscribe();
    //this.weeklyMatchListSubscription.unsubscribe();
    this.fixtureListSub.unsubscribe();
  }
}