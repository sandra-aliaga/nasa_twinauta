"""Render two silent English TwinNauta concept films. Pillow + local FFmpeg."""
from pathlib import Path
import math, random, subprocess, json, argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT=Path(__file__).resolve().parent
W,H,FPS=1920,1080,30
INK=(4,10,22);WHITE=(240,248,255);CYAN=(76,225,255);MINT=(105,255,206);AMBER=(255,194,100);MUTED=(163,193,214)
FONT_DIR=Path('C:/Windows/Fonts')
FONTS={}
def font(s,b=False):
 key=(s,b)
 if key not in FONTS:FONTS[key]=ImageFont.truetype(str(FONT_DIR/('segoeuib.ttf' if b else 'segoeui.ttf')),s)
 return FONTS[key]
def clamp(x):return max(0,min(1,x))
def ease(x):x=clamp(x);return x*x*(3-2*x)
def mix(a,b,x):return a+(b-a)*x

def txt(d,x,y,s,size=36,color=WHITE,b=False):d.text((int(x),int(y)),s,font=font(size,b),fill=color)
def lines(d,x,y,ss,size=88,color=WHITE,step=None):
 for i,s in enumerate(ss):txt(d,x,y+i*(step or size*1.14),s,size,color,True)
def box(d,rect,outline=CYAN,fill=(8,24,40,232),r=18):d.rounded_rectangle(rect,r,fill=fill,outline=outline,width=2)
def pill(d,x,y,s,col=CYAN):
 ww=d.textlength(s,font=font(23,True))+40
 d.rounded_rectangle((x,y,x+ww,y+44),22,fill=(11,35,49,230),outline=col,width=1);txt(d,x+20,y+5,s,23,col,True)
def centered(d,y,s,size=88,color=WHITE):
 ww=d.textlength(s,font=font(size,True));txt(d,(W-ww)/2,y,s,size,color,True)

ASSETS={k:Image.open(ROOT/'assets'/f'{k}.png').convert('RGB') for k in ['astronaut','anatomy']}
# Precomputed horizontal veil keeps headlines readable while art stays luminous.
veil=Image.new('RGBA',(W,H));vd=ImageDraw.Draw(veil)
for x in range(W):
 a=int(235*(1-clamp((x-400)/1150))+.0)
 vd.line((x,0,x,H),fill=(3,9,20,a))
bottom=Image.new('RGBA',(W,H));bd=ImageDraw.Draw(bottom)
for y in range(H):
 a=int(190*clamp((y-780)/300));bd.line((0,y,W,y),fill=(3,9,20,a))
random.seed(45)
STARS=[(random.randrange(W),random.randrange(H),random.random()*6) for _ in range(80)]

def art(name,t,strength=1):
 src=ASSETS[name];scale=H/src.height*(1.02+.045*math.sin(t*.12))
 sw,sh=int(src.width*scale),int(src.height*scale)
 image=src.resize((sw,sh),Image.Resampling.BICUBIC)
 bg=Image.new('RGB',(W,H),INK)
 # Right-anchored portrait creates a cinematic left-to-right composition.
 xx=W-sw+int(24*math.sin(t*.21));yy=(H-sh)//2
 bg.paste(image,(xx,yy))
 bg=bg.convert('RGBA');bg.alpha_composite(veil);bg.alpha_composite(bottom)
 return bg

def chrome(im,t,film):
 d=ImageDraw.Draw(im)
 txt(d,86,54,'TWINNAUTA',26,WHITE,True)
 d.ellipse((W-225,67,W-215,77),fill=MINT)
 txt(d,W-202,53,'CONCEPT FILM',17,MUTED)
 # Progress is subtle, continuous, and never competes with the story.
 d.line((86,1012,W-86,1012),fill=(29,56,72),width=2)
 d.line((86,1012,86+(W-172)*t/20,1012),fill=CYAN,width=3)
 txt(d,86,1030,'SPACE HEALTH RESEARCH PROTOTYPE',17,MUTED)
 txt(d,W-480,1030,'ILLUSTRATIVE VISUALS / SYNTHETIC CASE',15,MUTED)
 return im

def scanner(im,t,y0=145,y1=900):
 layer=Image.new('RGBA',(W,H));d=ImageDraw.Draw(layer)
 yy=mix(y0,y1,(t*.25)%1)
 d.line((1030,yy,1760,yy),fill=(*CYAN,180),width=2)
 for j in range(30):d.line((1030,yy-j,1760,yy-j),fill=(*CYAN,int(32*(1-j/30))))
 for x,y in [(1095,170),(1750,170),(1095,900),(1750,900)]:
  sx=1 if x<1400 else -1;sy=1 if y<500 else -1
  d.line((x,y,x+sx*32,y),fill=(*CYAN,120),width=2);d.line((x,y,x,y+sy*32),fill=(*CYAN,120),width=2)
 im.alpha_composite(layer)

def label(d,x,y,title,value,col=CYAN,w=350):
 box(d,(x,y,x+w,y+112),col)
 txt(d,x+22,y+17,title,21,col,True);txt(d,x+22,y+53,value,30,WHITE,True)

def network(im,t,center=(1360,515),compact=False):
 d=ImageDraw.Draw(im)
 names=['INDICATOR','EVIDENCE','CONTEXT','NEXT CHECK']
 nodes=[]
 for j in range(4):
  a=j*math.pi/2+t*.16
  nodes.append((center[0]+math.cos(a)*265,center[1]+math.sin(a)*185))
 for j,k in [(0,1),(1,2),(2,3),(3,0),(0,2)]:
  x,y=nodes[j];xx,yy=nodes[k];d.line((x,y,xx,yy),fill=(57,125,150,220),width=2)
  q=(t*.45+j*.2)%1;px=mix(x,xx,q);py=mix(y,yy,q)
  d.ellipse((px-5,py-5,px+5,py+5),fill=MINT)
 for j,(x,y) in enumerate(nodes):
  d.ellipse((x-12,y-12,x+12,y+12),fill=CYAN if j%2==0 else MINT)
  tw=d.textlength(names[j],font=font(20,True));txt(d,x-tw/2,y+25,names[j],20,WHITE,True)

BOUNDS_A=[0,3,6,9,13,17,20]
BOUNDS_B=[0,3,6,10,14,17,20]

def scene_a(i,u,t):
 bg=art('astronaut' if i<2 else 'anatomy',t)
 d=ImageDraw.Draw(bg)
 if i==0:
  txt(d,90,235,'BEYOND EARTH.',25,CYAN,True)
  lines(d,84,305,['THE MISSION','CONTINUES.'],100)
  txt(d,90,590,'Health remains part of every mission.',32,MUTED)
  # A moving orbital arc leads the eye toward the astronaut.
  d.arc((1010,160,1840,930),220+u*9,340+u*9,fill=CYAN,width=3)
 elif i==1:
  scanner(bg,t)
  lines(d,84,280,['YOUR BODY','CHANGES.'],106)
  txt(d,90,565,'Muscle. Function. Exercise.',34,CYAN,True)
  d.ellipse((1372,564,1508,700),outline=MINT,width=3)
 elif i==2:
  lines(d,84,255,['WHAT DO THE','NUMBERS MEAN?'],86)
  txt(d,90,492,'A measurement needs context.',34,MUTED)
  for j,(title,value) in enumerate([('MUSCLE AREA','Baseline?'),('KNEE TORQUE','Missing?'),('EXERCISE','Recorded?')]):
   xx=1040+(j%2)*270+math.sin(t+j)*20; yy=235+j*190
   label(d,int(xx),int(yy),title,value,AMBER if j==1 else CYAN,330)
 elif i==3:
  scanner(bg,t)
  txt(d,90,215,'INTRODUCING',25,MINT,True)
  txt(d,82,265,'TwinNauta',126,WHITE,True)
  lines(d,90,465,['Your indicators.','Their context.'],65,step=82)
  txt(d,94,685,'Connected around the body.',32,MUTED)
  for j,(title,value) in enumerate([('REGION','Quadriceps'),('MEASUREMENT','Check the baseline'),('FOLLOW-UP','Review the record')]):
   x=1220+(j%2)*70;y=220+j*195
   label(d,x,y,title,value,MINT if j==2 else CYAN,440)
 elif i==4:
  # Art recedes as the evidence relationship becomes the hero.
  shade=Image.new('RGBA',(W,H),(3,9,20,100));bg.alpha_composite(shade);d=ImageDraw.Draw(bg)
  lines(d,84,247,['TRACE THE','EVIDENCE.'],96)
  txt(d,90,505,'Know what needs checking.',36,MINT,True)
  network(bg,t)
  pill(d,90,635,'SOURCE / METHOD / LIMITS')
 else:
  bg=Image.new('RGBA',(W,H),(*INK,255));d=ImageDraw.Draw(bg)
  for j in range(5):
   rr=160+j*70+u*12;d.ellipse((960-rr,450-rr,960+rr,450+rr),outline=(18,45,62),width=2)
  centered(d,250,'TwinNauta',144)
  centered(d,450,'Understand the change.',64,CYAN)
  centered(d,535,'See the next step.',64)
  centered(d,730,'EXPLORE. CONNECT. UNDERSTAND.',25,MINT)
 return chrome(bg,t,'A')

def scene_b(i,u,t):
 bg=art('anatomy',t+5);d=ImageDraw.Draw(bg)
 if i==0:
  txt(d,90,215,'ONE CASE. TWO INTERPRETATIONS.',24,AMBER,True)
  lines(d,84,295,['MISSED','EXERCISE?'],112)
  label(d,1150,380,'EXERCISE SESSION','No record available',AMBER,550)
 elif i==1:
  lines(d,84,265,['OR JUST A','MISSING RECORD?'],88)
  txt(d,90,530,'Missing does not mean not done.',36,MINT,True)
  label(d,1150,380,'DATA STATUS','NOT RECORDED',AMBER,550)
  d.line((1190,540,1680,540),fill=MINT,width=3)
  txt(d,1190,563,'VERIFY BEFORE INTERPRETING',23,MINT,True)
 elif i==2:
  txt(d,90,210,'TWINNAUTA',25,MINT,True)
  lines(d,84,278,['CONTEXT CHANGES','THE QUESTION.'],82)
  txt(d,90,515,'Region. Baseline. Exercise history.',32,MUTED)
  scanner(bg,t)
  for j,(title,value) in enumerate([('REGION','Quadriceps'),('MUSCLE AREA','Relative to baseline'),('EXERCISE LOG','Needs confirmation')]):label(d,1170,220+j*195,title,value,CYAN if j<2 else AMBER,530)
 elif i==3:
  lines(d,84,255,['CHECK THE','SOURCE.'],102)
  txt(d,90,525,'Understand its limits.',38,MINT,True)
  # Evidence sheet unfolds in the foreground; these are project references.
  y=185;box(d,(1110,y,1780,810),CYAN,fill=(8,24,40,247))
  txt(d,1150,225,'RESEARCH CONTEXT',24,CYAN,True)
  txt(d,1150,286,'Scott 2020 / SPRINT 2024',32,WHITE,True)
  for j,(a,b) in enumerate([('POPULATION','Who was studied?'),('METHOD','What was measured?'),('LIMITS','Does it apply here?')]):
   yy=385+j*120;txt(d,1150,yy,a,21,MINT,True);txt(d,1150,yy+34,b,30)
  txt(d,1150,765,'References, not clinical validation.',22,MUTED)
 elif i==4:
  txt(d,90,220,'A CLEARER NEXT STEP',25,MINT,True)
  lines(d,84,295,['CONFIRM','THE RECORD.'],98)
  txt(d,90,550,'Then review what the data can tell you.',30,MUTED)
  box(d,(1125,320,1780,660),MINT)
  d.ellipse((1180,372,1240,432),outline=MINT,width=3)
  d.line((1194,402,1208,416,1228,388),fill=MINT,width=5)
  txt(d,1280,379,'NEXT CHECK',27,MINT,True)
  txt(d,1180,475,'Confirm the session record.',32,WHITE,True)
  txt(d,1180,541,'Human review stays in the loop.',26,MUTED)
 else:
  bg=Image.new('RGBA',(W,H),(*INK,255));d=ImageDraw.Draw(bg)
  network(bg,t,(1450,550))
  txt(d,88,235,'TwinNauta',128,WHITE,True)
  lines(d,94,455,['Connected data.','Traceable evidence.','Human decisions.'],57,step=85)
  pill(d,98,790,'UNDERSTAND BEFORE YOU ACT',MINT)
 return chrome(bg,t,'B')

def render(which):
 name='01_The_Mission_Continues_EN' if which=='A' else '02_Missing_Record_EN'
 bounds=BOUNDS_A if which=='A' else BOUNDS_B;fn=scene_a if which=='A' else scene_b
 out=ROOT/(name+'.mp4');stills=[]
 cmd=['ffmpeg','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(out)]
 with (ROOT/(name+'_render.log')).open('w') as log:
  p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log)
  try:
   for n in range(600):
    t=n/FPS;i=max(j for j in range(6) if t>=bounds[j]);u=t-bounds[i]
    im=fn(i,u,t)
    if i and u<.28:
     previous=fn(i-1,bounds[i]-bounds[i-1],t)
     im=Image.blend(previous,im,ease(u/.28))
    if n<12:im=Image.blend(Image.new('RGBA',(W,H),(*INK,255)),im,ease(n/12))
    if n in [int((bounds[j]+.9)*FPS) for j in range(6)]:stills.append(im.convert('RGB').resize((640,360)))
    p.stdin.write(im.convert('RGB').tobytes())
    if n%120==0:print(f'{which}: {n}/600 frames',flush=True)
  finally:p.stdin.close()
  if p.wait()!=0:raise RuntimeError('FFmpeg failed: inspect render log')
 board=Image.new('RGB',(1920,720),INK)
 for j,im in enumerate(stills):board.paste(im,((j%3)*640,(j//3)*360))
 board.save(ROOT/(name+'_storyboard.jpg'),quality=94)
 result=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,size','-show_entries','stream=codec_type,width,height,r_frame_rate','-of','json',str(out)],capture_output=True,text=True,check=True)
 data=json.loads(result.stdout)
 assert len(data['streams'])==1 and data['streams'][0]['codec_type']=='video'
 assert abs(float(data['format']['duration'])-20)<.01
 (ROOT/(name+'_verification.json')).write_text(json.dumps(data,indent=2),encoding='utf-8')
 print(f'Finished {out.name}',flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--film',choices=['A','B','both'],default='both');args=parser.parse_args()
 for film in ('A','B') if args.film=='both' else (args.film,):render(film)
