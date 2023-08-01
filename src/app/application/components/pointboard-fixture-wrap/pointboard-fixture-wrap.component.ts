import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription } from 'rxjs';

import { SeasonsModel } from "../../models/application-seasons.model";
import { SeasonsService } from "../../services/application-seasons.service";

import { LeaguesModel } from "../../models/application-leagues.model";
import { LeaguesService } from "../../services/application-leagues.service";

import { GroupStagesModel } from "../../models/application-groupstages.model";
import { GroupStagesService } from "../../services/application-groupstages.service";

import { TeamsInGroupstagesModel } from "../../models/application-teams-in-groupstages.model";
import { TeamsInGroupstagesService } from "../../services/application-teams-in-groupstages.service";

import { FixtureModel } from "../../models/application-fixture.model";
import { FixtureSearchModel } from "../../models/application-fixture-search-index.model";
import { FixtureService } from "../../services/application-fixtures.service";

import { PointBoardModel } from "../../models/application-pointboard.model";
import { PointBoardService } from "../../services/application-pointboard.service";

import { globalFunctions } from "../../../functions/global.function";
import { fontAwesomeIconList } from "../../../assets/lists/font-awesome-icon.list";


@Component({
  selector: 'app-application-pointboard-fixture-wrap',
  templateUrl: './pointboard-fixture-wrap.component.html',
  styleUrls: ['../../../app.component.css', './pointboard-fixture-wrap.component.css']
})
export class ApplicationPointBoardFixtureWrap implements OnInit, OnDestroy {
  toolbarTitle = "PUAN TABLOSU VE FİKSTÜR";
  seasonList: SeasonsModel[] = [];
  private seasonListSub: Subscription;
  leagueList: LeaguesModel[] = [];
  private leagueListSub: Subscription;
  groupstageList: GroupStagesModel[] = [];
  private groupstageListSub: Subscription;
  weekSequenceList: Array<number>[] = [];
  private weekSequenceListSub: Subscription;

  fixtureSearchIndex = <FixtureSearchModel>{};
  fontAwesomeIconList = fontAwesomeIconList;

  @Input() seasonSelectionId: number;
  @Input() leagueSelectionId: number;
  @Input() groupstageSelectionId: number;
  @Input() matchWeekSelectionValue: number;

  constructor(
    public seasonsService: SeasonsService,
    public leaguesService: LeaguesService,
    public groupstagesService: GroupStagesService,
    public teamsingroupstageService: TeamsInGroupstagesService,
    public fixtureService: FixtureService,
    public pointboardService: PointBoardService,
    private globalFunctions: globalFunctions
  ) {}

  ngOnInit(): void {
    this.globalFunctions.setToolbarTitle(this.toolbarTitle);
    this.seasonsService.getSeasons();
    this.seasonListSub = this.seasonsService.getSeasonsListUpdateListener()
      .subscribe({
        next: (data: SeasonsModel[]) => {
          if (data.length > 0) {
            this.seasonList = data;
            this.seasonSelectionId = this.seasonList[0].id;
            this.leaguesService.getLeagues(this.seasonSelectionId);
          } else {
            this.seasonList = [];
            this.leagueList = [];
            this.groupstageList = [];
            this.weekSequenceList = [];

            this.seasonSelectionId = null;
            this.leagueSelectionId = null;
            this.groupstageSelectionId = null;
            this.matchWeekSelectionValue = null;
          }
        },
        error: (error) => {
        }
      });

    this.leagueListSub = this.leaguesService.getLeagueListUpdateListener()
      .subscribe({
        next: (data: LeaguesModel[]) => {
          if (data.length > 0) {
            this.leagueList = data;
            this.leagueSelectionId = this.leagueList[0].id;
            this.groupstagesService.getGroupstages(this.leagueSelectionId);
          } else {
            this.leagueList = [];
            this.groupstageList = [];
            this.weekSequenceList = [];

            this.leagueSelectionId = null;
            this.groupstageSelectionId = null;
            this.matchWeekSelectionValue = null;
          }
        },
        error: (error) => {
        }
      });

    this.groupstageListSub = this.groupstagesService.getGroupStageListUpdateListener()
      .subscribe({
        next: (data: GroupStagesModel[]) => {
          if (data.length > 0) {
            this.groupstageList = data;
            this.groupstageSelectionId = this.groupstageList[0].id;
            this.groupstagesService.getGroupWeeks(this.groupstageSelectionId);
            this.groupstagesService.getPlayedLastMatchWeek(this.groupstageSelectionId)
              .subscribe({
                next: (data: any) => {
                  // call onSearch only if matchWeekSelectionValue is null before assignment, means work only page loaded.
                  // Subsequently, only the onSearch button will be searched.
                  if (!this.matchWeekSelectionValue) {
                    this.teamsingroupstageService.getTeamsInGroupstages(this.groupstageSelectionId);
                    this.matchWeekSelectionValue = data.matchWeek;
                    this.onSearch();
                  } else {
                    this.matchWeekSelectionValue = data.matchWeek;
                  }
                },
                error: (error) => {
                }
              });
          } else {
            this.groupstageList = [];
            this.weekSequenceList = [];

            this.groupstageSelectionId = null;
            this.matchWeekSelectionValue = null;
          }
        },
        error: (error) => {
        }
      });

    this.weekSequenceListSub = this.groupstagesService.getGroupWeeksUpdateListener()
      .subscribe({
        next: (data: Array<number>[]) => {
          this.weekSequenceList = data;
        },
        error: (error) => {

        }
      });
  }

  onSeasonChange() {
    this.leaguesService.getLeagues(this.seasonSelectionId);
  }

  onLeagueChange() {
      this.groupstagesService.getGroupstages(this.leagueSelectionId);
  }

  onGroupStageChange() {
    this.groupstagesService.getGroupWeeks(this.groupstageSelectionId);
  }

  onSearch() {
    // Get Teams In Disqualifications
    this.teamsingroupstageService.getTeamsInGroupstages(this.groupstageSelectionId);

    //Get Point Board
    this.pointboardService.getPointBoard(this.groupstageSelectionId, this.matchWeekSelectionValue);

    // Get Fixture
    this.fixtureSearchIndex.seasonId = this.seasonSelectionId || null;
    this.fixtureSearchIndex.leagueId = this.leagueSelectionId || null;
    this.fixtureSearchIndex.groupstageId = this.groupstageSelectionId || null;
    this.fixtureSearchIndex.matchWeek = this.matchWeekSelectionValue || null;
    this.fixtureService.getFixtureBySearchIndex(this.fixtureSearchIndex);
  }

  ngOnDestroy(): void {
    this.seasonListSub.unsubscribe();
    this.leagueListSub.unsubscribe();
    this.groupstageListSub.unsubscribe();
    this.weekSequenceListSub.unsubscribe();
  }
}