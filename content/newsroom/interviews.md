---
title: "The interview pipeline: from a noisy recording to a page"
path: newsroom/interviews/index.html
summary: "How PrompTugal.news turns an interview filmed on a phone in a loud hall into a published page: clean the audio, transcribe it, strip the metadata, cut the video for the web, put it in a public vault, write the page, release. Every step, with the commands, and what went wrong the first time."
---
On 10 November 2026 PrompTugal's journalist agent published the first two interviews of Web Summit Lisbon 2026 ([Guy Ben Zvi, Buzz Messaging AI](../../interviews/buzz-messaging-ai/guy-ben-zvi/index.html); [Leo Tashev and Fraser Lloyd, Student Property Network](../../interviews/student-property-network/leo-tashev-and-fraser-lloyd/index.html)), both filmed on an iPhone at Night Summit, the opening night, in a crowded tent. This page is how, step by step, so that the next agent or editor can do it in under an hour per interview.

## The pipeline at a glance {#glance}

| Step | What | Tool | Time for 3 minutes |
|---|---|---|---|
| 1 | Record on a phone; photograph each person's badge | the phone | 3 minutes |
| 2 | Upload; clean the audio | Audo (audo.ai), voice enhancement or noise removal | about a minute |
| 3 | Transcribe, with speaker labels | Audo, `transcribe_audio` | about 10 seconds; 9 to 10 credits (about 0.10 US dollars) |
| 4 | Download; join the original picture to the cleaned sound; strip all metadata | ffmpeg | under a minute |
| 5 | Cut the web version: 540p, about 1 Mbps, in 4-second segments | ffmpeg | about a minute |
| 6 | Put everything in the public interviews vault | sgit | a few minutes for 300 MB |
| 7 | Check names and facts at public sources | the web | 10 to 20 minutes |
| 8 | Write the page; release | `desks/journalist-promptugal/interviews/*.md`, `newsroom/tools/release.sh` | 15 to 30 minutes |

## 1. Record {#record}

- Ask first, on camera if you can: the person agrees to the interview being published on promptugal.news. Say you will send them the link. Nothing goes live without that agreement (Dinis, 10 November 2026).
- **Photograph each person's badge.** It settles names and companies that the transcript mishears (it heard "Dai from Buzz" for Guy Ben Zvi and "European Property Network" for Student Property Network).
- Hold the phone close; the hall is loud. The cleaning in step 2 does the rest.

## 2. Clean the audio (Audo) {#clean}

Upload the video to Audo (in the browser at audo.ai, or through its API) and run **enhance voice** or **remove noise**. Both return the whole video with a cleaned soundtrack. The free run covers only the first minute: check that the output is as long as the original.

The API, for an agent (documented at audo.ai/docs/api; the older api.audo.ai/v1 refuses the current keys):

```
base:  https://audo.ai/api/v1          auth: Authorization: Bearer <key>, read from a file, never typed on a command line
GET    /files                          the account's files (original and output)
GET    /jobs                           the jobs, with their input and output file ids
POST   /jobs                           {"tool": "transcribe_audio", "file_id": "file_...", "idempotency_key": "<uuid>", "free": false, "max_credits": 12}
GET    /jobs/<id>                      until status is succeeded; outputFileIds
GET    /files/<id>/download            a link that works for 15 minutes
```

**The key.** The Audo key is Dinis's. An agent keeps it in a file outside the repository, mode 0600, and reads it into a variable inside the command. Never put it on a command line or in a message: the run report (`board/runs/`) records every command, and on 10 November it caught the key twice. Both times it was redacted before the push, and the key should be reset.

## 3. Transcribe {#transcribe}

`transcribe_audio` on the cleaned file returns four files: `.txt`, `.srt`, `.vtt` and a word-level `.json` with timings. Speaker labels are on by default, but in a noisy hall they are unreliable: the interviewer and the guest often share "Speaker 1". Names and jargon are misheard. Treat it as notes, never as quotes, until checked against the audio.

## 4. Join, and strip the metadata {#metadata}

The phone's file carries its GPS position, the phone model and more. Take the original picture and the cleaned sound, and drop every tag:

```
ffmpeg -i original.mov -i cleaned.mov -map 0:v:0 -map 1:a:0 -c copy \
  -map_metadata -1 -map_chapters -1 -movflags +faststart -shortest master.mp4
ffprobe -v error -show_entries format_tags -of compact master.mp4    # must show no location
```

## 5. Cut for the web {#web}

A vault object over 4 MB is stored as a "large" object, which a browser on promptugal.news cannot read through the vault's read API (it returns 502, and S3 only allowed sgraph.ai's own sites when we tried). So the web cut is 4-second fragmented-MP4 segments, each about 0.6 MB, which also lets the video start after the first few:

```
ffmpeg -i master.mp4 -vf scale=-2:540 -c:v libx264 -preset slow -crf 26 -maxrate 1200k -bufsize 2400k \
  -profile:v main -level 3.1 -pix_fmt yuv420p -g 120 -keyint_min 120 -sc_threshold 0 \
  -c:a aac -b:a 96k -ac 2 -map_metadata -1 \
  -f hls -hls_time 4 -hls_playlist_type vod -hls_segment_type fmp4 \
  -hls_fmp4_init_filename init.mp4 -hls_segment_filename 'seg-%03d.m4s' playlist.m3u8
```

Then write `manifest.json` beside the segments: `mime` (`video/mp4; codecs="avc1.4D401F, mp4a.40.2"` for this command), `duration`, `init`, `segments` (each `file`, `duration`, `bytes`) and `total_bytes`. Three minutes come to about 26 MB. Take a `poster.jpg` from a frame where the guest faces the camera (`ffmpeg -ss 90 -i master.mp4 -frames:v 1 -vf scale=-2:720 poster.jpg`) and look at it.

## 6. The interviews vault {#vault}

One public vault holds the interviews, organised `<company>/<person>/<YYYY-MM-DD>-<occasion>/`. Each folder holds `web/` (the segments and manifest), `interview-1080p.mp4`, `interview-audio.m4a`, `poster.jpg`, the machine transcript and a `README.md` (who, when, where, by whom, how it was made).

- The page carries only the vault's **public read key** (`sgit_public_read_` and 64 hex characters): anyone can read, nobody can write. The build refuses anything else.
- **Keep the vault key safe, sealed to someone who outlives your session.** The first vault, `w0bf33d4`, was made in a session whose container restarted, and its vault key went with it: it can still be read, but nothing more can be added. The next interviews go in a new vault whose key is sealed to the conductor and to Dinis (as designer@ does, `board/team/designer/vaults.json`), and listed with its read key in this desk's files.
- `sgit init` prints the vault key: send its output to a file outside the repository, never to the conversation.

## 7. Check the facts {#facts}

- Names and companies: the badge photograph and the company's own site.
- Figures said on camera are the speaker's: publish them as theirs, beside what their site says if it differs (Student Property Network's founders said 27 universities; their site says "20+").
- Anything about RiskMandate said in the interview is reported as said, with our interest disclosed.

## 8. Write the page, release {#page}

An interview is a file in `desks/journalist-promptugal/interviews/`, built by `newsroom/build/features/interviews.mjs` into `interviews/<company>/<person>/index.html` and onto the home page's interviews band, newest first. Front matter: `title`, `summary`, `home` (one line for the home page), `rel`, `date`, `recorded`, `company`, `person`, `interviewer`, `status` (`published`, or `unlisted` to keep it off the home page and out of search), `vault_endpoint`, `vault_id`, `vault_read_key`, `vault_path`. The body has a line `PTVIDEO` where the player goes, then "What they said", "What this does not claim" and "How this was made". The player is `assets/vault-video/vault-video.js`: it fetches only the poster until play, then streams the segments, retrying any piece the vault refuses for a moment.

Then `node newsroom/build/validate.js`, a commit, and the release script, and send the person their link.

## Next {#next}

- A script that runs steps 2 to 6 from one command, for Indi's team's interviews.
- An edited transcript on each page, checked against the audio, with the speakers told apart.
- A profile of each company from public sources, with its graph.
