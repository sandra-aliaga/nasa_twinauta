#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
out=output/playwright
mkdir -p "$out/edit"
font=/usr/share/fonts/TTF/DejaVuSans-Bold.ttf
astronaut=$(find presentacion/videos -maxdepth 1 -name 'Astronaut*.mp4' -print -quit)
tour="$out/recorrido-ingles.webm"

render() {
  local name=$1 input=$2 start=$3 duration=$4 framing=$5 title=$6 subtitle=$7
  ffmpeg -hide_banner -loglevel error -y -ss "$start" -i "$input" -t "$duration" \
    -vf "$framing,fps=30,setsar=1,drawbox=x=0:y=902:w=iw:h=178:color=0x080c25@0.92:t=fill,drawbox=x=64:y=938:w=5:h=94:color=0x75e7ff:t=fill,drawtext=fontfile=$font:text='$title':x=90:y=929:fontsize=52:fontcolor=white,drawtext=fontfile=$font:text='$subtitle':x=92:y=1000:fontsize=25:fontcolor=0xaec7ec,fade=t=in:st=0:d=0.12" \
    -an -c:v libx264 -threads 4 -preset fast -crf 18 -pix_fmt yuv420p "$out/edit/$name.mp4"
}

# Keep source clips intact. The upper crop removes generated window lettering.
ffmpeg -hide_banner -loglevel error -y \
  -i presentacion/videos/Man_resting_in_hospital_bed_ae9be75b.mp4 \
  -vf 'crop=1120:630:80:90,scale=1920:1080' -an \
  -c:v libx264 -threads 4 -preset fast -crf 18 "$out/hospital-sin-texto.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$out/hospital-sin-texto.mp4" \
  -filter_complex '[0:v]split[a][b];[a]trim=0:2.7,setpts=PTS-STARTPTS[a1];[b]trim=5.5:7.8,setpts=PTS-STARTPTS[b1];[a1][b1]concat=n=2:v=1:a=0[v]' \
  -map '[v]' -an -c:v libx264 -threads 4 -preset fast -crf 18 "$out/hospital-misti-5s.mp4"

render 01 "$astronaut" 3.8 4 'scale=1920:1080' \
  'FAR FROM EARTH. YOUR BODY CHANGES.' 'Understanding the change is only the beginning.'
render 02 "$tour" 1 2 'scale=1920:1080' \
  'MEET TWINNAUTA.' 'Explore health measurements through an anatomical interface.'
render 03 "$tour" 4.6 3 'crop=960:540:960:100,scale=1920:1080' \
  '01  WHAT IS HAPPENING?' 'Inspect measurements and trace their source.'
render 04 "$tour" 8.2 3 'crop=960:540:960:320,scale=1920:1080' \
  '02  WHAT COULD HAPPEN?' 'Compare published study results and their limits.'
render 05 "$tour" 11.5 3 'crop=960:540:960:150,scale=1920:1080' \
  '03  WHAT CAN I DO?' 'Explore documented next steps and supporting evidence.'
render 06 "$tour" 16 4 "crop=1440:810:20:80,scale=1920:1080,zoompan=z='1+0.08*on/120':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=30" \
  'FOLLOW THE EVIDENCE.' 'MEASUREMENTS  --  CONNECTED STUDIES  --  NEXT STEPS'
render 07 "$tour" 25 3 'crop=800:450:720:270,scale=1920:1080' \
  'OPEN THE RESEARCH.' 'Read the findings. Understand the methods and limits.'
render 08 "$out/hospital-misti-5s.mp4" 0 4 'setpts=0.8*PTS,scale=1920:1080' \
  'THE CHALLENGE REACHES EARTH.' 'Our vision - exploring hospital applications in Arequipa.'
render 09 "$tour" 1 4 'scale=1920:1080,gblur=sigma=24,drawbox=x=0:y=0:w=iw:h=ih:color=0x080c25@0.6:t=fill,drawtext=fontfile=/usr/share/fonts/TTF/DejaVuSans-Bold.ttf:text=TwinNauta:x=(w-tw)/2:y=350:fontsize=116:fontcolor=white,drawtext=fontfile=/usr/share/fonts/TTF/DejaVuSans.ttf:text=twinnauta.health:x=(w-tw)/2:y=515:fontsize=64:fontcolor=0x75e7ff' \
  'UNDERSTAND. EXPLORE. ACT WITH EVIDENCE.' 'TwinNauta - NASA Space Apps'

for part in "$out"/edit/0*.mp4; do printf "file '%s'\n" "$(realpath "$part")"; done > "$out/edit/concat.txt"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$out/edit/concat.txt" \
  -c copy -movflags +faststart "$out/TwinNauta-30s-EN.mp4"
for part in "$out"/edit/0{2,3,4,5,6,7}.mp4; do printf "file '%s'\n" "$(realpath "$part")"; done > "$out/edit/tour.txt"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$out/edit/tour.txt" \
  -c copy -movflags +faststart "$out/recorrido-con-zooms-18s.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$tour" -an -c:v libx264 \
  -threads 4 -preset fast -crf 18 -pix_fmt yuv420p -movflags +faststart "$out/recorrido-ingles.mp4"
