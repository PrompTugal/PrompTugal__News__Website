# Account B: every active session (ASCII view)

Written by maestro.b (account-b) at 2026-11-19T02:03Z from list_sessions, get_session and list_triggers (status and cost only, never transcripts). Rewritten at each wake.

```
+============================================================================================+
| ACCOUNT B: EVERY ACTIVE SESSION, ITS STATE, BLOCKERS AND SCHEDULE                          |
| maestro.b (account-b), 2026-11-19T02:03Z                                                   |
| from list_sessions, get_session, list_triggers (status only, never transcripts)            |
+============================================================================================+
  >> working   ok idle, last turn done   !! blocked: waits on a person   XX failed
  wake = the enabled scheduled task wired to it; "-- none --" = runs only when someone writes to it

     session                                last  wake                         cost
  .-- FOCUSED CONDUCTORS --------------------------------------------------------------------
  | ok conductor.b@                       02:00Z  hourly :48 UTC               $323
  | ok cells.b (AgentiCCells)             01:51Z  one-shot 02:04 (PR #35 c      $14
  | >> writer-10 (newsroom.sgit.ai)       01:55Z  09:47+18:47 London            $16
  '------------------------------------------------------------------------------------------

  .-- AGENTICCELLS (cells.b's own conductors) -----------------------------------------------
  | !! conductor.evals@                   01:17Z  -- none --                       
  |    '-> Dinis to grant write access so release.sh can push round 1
  | !! cells.b conductor (private project 01:18Z  -- none --                       
  |    '-> instructions for its next step
  '------------------------------------------------------------------------------------------

  .-- SIDE-CARS -----------------------------------------------------------------------------
  | ok telemetry.b@                       01:29Z  hourly :26 UTC                 $9
  | >> abp@                               01:57Z  hourly :37 UTC                   
  | !! rights@                            01:48Z  hourly :45 UTC                   
  |    '-> answers on the cyber sources, the IPMA warning quoted in prose, and the Vertex sea
  | !! security@                          01:55Z  1h day/3h night :03              
  |    '-> Dinis: answer S41, S48, S50, S51, the non-commercial cyber sources question, and t
  '------------------------------------------------------------------------------------------

  .-- PROMPTUGAL MAIN TEAM (under conductor.b@) ---------------------------------------------
  | ok journalist@                        01:48Z  hourly :40 UTC                   
  | ok dev@                               02:00Z  hourly :08 UTC                   
  | ok designer@                          01:41Z  2h :33 UTC                       
  | ok correspondent@                     00:52Z  2h :44 UTC                       
  | ok ontologist@                        00:31Z  2h :21 UTC                       
  | ok researcher@                        01:14Z  hourly :13 UTC                   
  | ok datasci.places@                    01:16Z  hourly :15 UTC                   
  | ok dev.places@                        01:12Z  hourly :11 UTC                   
  | ok designer.places@                   01:00Z  2h :52 UTC                       
  | ok translator@                        00:59Z  3h :57 UTC                       
  | ok outreach@                          00:49Z  3h :38 UTC                       
  | !! sherpa@                            00:30Z  3h :29 UTC                       
  |    '-> provide the missing sgit inbox token
  | ok librarian@                         01:03Z  3h :56 UTC                       
  | ok place.algarve.west@                01:21Z  hourly :20 UTC                   
  | ok place.algarve.central@             01:26Z  hourly :25 UTC                   
  | ok place.algarve.east@                01:42Z  hourly :30 UTC                   
  | ok place.districts@                   00:38Z  2h :35 UTC                       
  '------------------------------------------------------------------------------------------

  .-- PROMPTUGAL SITE LEADS (under conductor.b@) --------------------------------------------
  | ok data.b@                            01:50Z  hourly :03 Lis                   
  | ok weather.b@                         01:50Z  3h 07-22 Lis :13                 
  | ok civic.b@                           01:50Z  3h 07-22 Lis :23                 
  | ok startups.b@                        01:50Z  3h 07-22 Lis :43                 
  | ok travel.b@                          01:50Z  3h 07-22 Lis :53                 
  | ok events.b@                          01:50Z  3h 07-22 Lis :33                 
  | ok signals.b@                         01:53Z  3h 07-22 Lis :28                 
  | ok library.b@                         01:55Z  3h 07-22 Lis :38                 
  | ok videos.b@                          01:50Z  3h 07-22 Lis :48                 
  | ok live.b@                            01:50Z  3h 07-22 Lis :08                 
  | ok cyber.b@                           01:52Z  3h 07-22 Lis :18                 
  | !! bulletins.b@                       01:52Z  3h 07-22 Lis :58                 
  |    '-> which format to build first, whether you want audio now, and how often bulletins s
  '------------------------------------------------------------------------------------------

  .-- THIS SESSION --------------------------------------------------------------------------
  | >> maestro.b (account-b)              02:01Z  hourly :18 UTC                   
  '------------------------------------------------------------------------------------------

  .-- DORMANT: idle since before 18 Nov, no enabled wake -----------------------------------
  | 61 sessions: the Fringe swarm (11-14 Nov), the iOS team and night push (7-11 Nov),
  | the first account-B dev.* workers, backup, historian, customers, investors.packs (7-13 Nov).
  | 18 still read 'blocked', most on a board/HOLD.md that no longer exists: stale, not live.
  | None has a wake, so none costs anything while idle. Archiving them is Dinis's call.
  '------------------------------------------------------------------------------------------

  +----------------------------------------------------------------------------------------+
  | active: 39   blocked on a person: 6   active with no wake: 2                           |
  | enabled wakes: 34 recurring + 1 one-shot; none points at a dead session                |
  | cost: telemetry.b@'s last count, about $1,722 for 35 sessions (+$170 in its last hour) |
  +----------------------------------------------------------------------------------------+

  WAKE CLOCK: the minute past each hour (UTC unless *; * = Lisbon time: 3-hourly 07-22, data.b hourly)
   :00 | 03 data.b*+security  08 live.b*+dev
   :10 | 11 dev.places  13 weather.b*+researcher  15 datasci.places  18 maestro.b+cyber.b*
   :20 | 20 place.algarve.west  21 ontologist  23 civic.b*  25 place.algarve.central  26 telemetry.b  28 signals.b*  29 sherpa
   :30 | 30 place.algarve.east  33 events.b*+designer  35 place.districts  37 abp  38 library.b*+outreach
   :40 | 40 journalist  43 startups.b*  44 correspondent  45 rights  47 writer-10  48 videos.b*+conductor.b
   :50 | 52 designer.places  53 travel.b*  56 librarian  57 translator  58 bulletins.b*
   (writer-10 twice a day at 09:47 and 18:47 London; cells.b one-shot at 02:04 UTC)
```
