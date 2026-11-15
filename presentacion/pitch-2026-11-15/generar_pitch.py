"""Build the editable pitch and speaker script from local presentation assets."""

from itertools import pairwise
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.xmlchemy import OxmlElement
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
BG = "07111F"
PANEL = "101F31"
INK = "EDF5FC"
MUTED = "A8BED0"
CYAN = "4EE2E1"
LIME = "CCF878"
DARK = "082029"
FONT = "DejaVu Sans"
SOURCES = {
    "DAS": "https://www.nasa.gov/general/digital-astronaut-simulation-tool/",
    "HDTP": "https://techport.nasa.gov/projects/154412",
    "CMO": "https://ntrs.nasa.gov/citations/20260001797",
    "SCOTT": "https://doi.org/10.1097/CCE.0000000000000269",
    "SPRINT": "https://doi.org/10.1152/japplphysiol.00489.2023",
    "KAKIHARA": "https://doi.org/10.1007/s40200-025-01676-8",
    "PADILHA": "https://doi.org/10.1002/jcsm.70259",
    "PHYSIONET": "https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/",
    "MULAVARA": "https://doi.org/10.1249/MSS.0000000000001615",
    "CDC_VTE": "https://www.cdc.gov/blood-clots/risk-factors/ha-vte.html",
}
NOTES = [
    (
        15,
        "TwinNauta",
        "We are TwinNauta. Our proposal brings together digital twin concepts and decision support for health monitoring on long-duration space missions. Today we present a research prototype that connects health indicators, scientific evidence and the next information to check.",
    ),
    (
        18,
        "The body changes. The mission continues.",
        "The challenge is to gather indicators so astronauts can assess their health and act. We start with muscle monitoring and a separate heart-rate demonstration. The goal is to interpret available information and recognize when something important is missing.",
    ),
    (
        23,
        "NASA already simulates the human body.",
        "NASA already uses biomechanical simulation and develops human digital twin and decision-support projects. We build on published research. Our proposed contribution is a way to connect indicators, context and sources. TwinNauta does not integrate DAS, HDTP or CMO-DA, and does not claim to have invented digital twins.",
    ),
    (
        24,
        "Three questions. One next step.",
        "Select a body region and explore three questions: what do we know, what implications does the literature describe, and what should we check next? Start with a summary, then explore measurements, papers and their links. Evidence from another population or protocol does not automatically apply to this case.",
    ),
    (
        26,
        "Did they skip training? Or was it not recorded?",
        "On day ten of our synthetic case, an exercise session is not recorded and a torque assessment is missing. This does not demonstrate non-adherence or muscle loss. The next step is to confirm what information exists. Our diagram organizes questions about measurements, records, methods and resources, rather than assigning a medical cause.",
    ),
    (
        27,
        "Every summary leads back to its source.",
        "The library connects paper records, prepared summaries and excerpts from abstracts. Population, methods, environment and limitations affect interpretation. Scott and SPRINT come from the same experimental program, so they are not independent validations. The map connects observations and literature with an explanation, its limits and a next check; its links do not establish causation.",
    ),
    (
        24,
        "A focused scope. A working prototype.",
        "We currently have one quadriceps module, twenty-seven candidate publications and twenty-six prepared summaries. The flow connects assessment, library and case explanations. We track muscle area, knee-extension torque and exercise records. The case is synthetic; the predictive muscle model and scientific review remain pending. This demonstrates integration, not clinical effectiveness.",
    ),
    (
        25,
        "Heart rate. Context before alerts.",
        "Heart rate adds a real terrestrial exercise recording from PhysioNet, kept separate from the virtual astronaut. The application plays time windows and preserves missing readings without inventing values. This slide uses an illustrative schematic, not the recording. It demonstrates monitoring and data quality, without converting heart-rate variation into a diagnosis or an estimate of muscle loss.",
    ),
    (
        20,
        "Prepare on Earth. Consult on board.",
        "We separate preparation from consultation. Explanations are generated beforehand and stored; opening them does not trigger another AI request. Today they are read from the local database. We still need to verify the complete offline flow, including access to documents, before claiming full mission autonomy.",
    ),
    (
        45,
        "From space to the hospital",
        "The original proposal connects space and hospital settings: some consequences of disuse and deconditioning may overlap, although the environments differ. Mulavara compared tests after six-month space missions and seventy days of experimental bed rest. Hospital immobility, together with surgery or acute illness, can also increase thromboembolic risk; that statement has a separate CDC source and is not a result of our muscle module. Microgravity adds its own changes, including fluid shifts. We therefore keep the analogy and its limits visible rather than transferring spaceflight parameters directly to patients.",
    ),
    (
        53,
        "TwinNauta in Arequipa",
        "We retain the original regional goal: explore a hospital pilot in Arequipa. Its proposed scope includes contextualizing activity, mobility and functional progress; supporting exercise follow-up under clinical protocols; and flagging changes for professional assessment. Supporting clinical assessment of thromboembolic risk would be a future function, without diagnosing or ruling out thrombosis. These are proposed applications, not an operating hospital service. The regional goal is to assess safety, usability and clinical usefulness before implementation, with healthcare professionals involved. The research provides context for that goal, not proof that this prototype is clinically validated.",
    ),
]


def rgb(value):
    return RGBColor.from_string(value)


def box(slide, x, y, w, h, fill, line=None, radius=False):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE,
        Inches(x),
        Inches(y),
        Inches(w),
        Inches(h),
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb(fill)
    if line:
        shape.line.color.rgb = rgb(line)
    else:
        shape.line.fill.background()
    return shape


def text(
    slide,
    content,
    x,
    y,
    w,
    h,
    size=24,
    color=INK,
    bold=False,
    align=PP_ALIGN.LEFT,
    url=None,
):
    shape = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    frame = shape.text_frame
    frame.clear()
    frame.word_wrap = True
    frame.margin_left = frame.margin_right = 0
    frame.margin_top = frame.margin_bottom = 0
    frame.vertical_anchor = MSO_ANCHOR.TOP
    for index, line in enumerate(content.split("\n")):
        p = frame.paragraphs[0] if index == 0 else frame.add_paragraph()
        p.alignment = align
        p.space_after = Pt(2)
        p.line_spacing = 1.08
        run = p.add_run()
        run.text = line
        run.font.name = FONT
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = rgb(color)
        if url:
            run.hyperlink.address = url
    return shape


def line(slide, x1, y1, x2, y2, color=CYAN, width=1.5):
    conn = slide.shapes.add_connector(
        MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2)
    )
    conn.line.color.rgb = rgb(color)
    conn.line.width = Pt(width)
    return conn


def picture(slide, filename, x, y, w, h):
    from PIL import Image

    path = ASSETS / filename
    with Image.open(path) as image:
        ratio = image.width / image.height
    pic = slide.shapes.add_picture(
        str(path), Inches(x), Inches(y), width=Inches(w), height=Inches(h)
    )
    target = w / h
    if ratio > target:
        pic.crop_left = pic.crop_right = (1 - target / ratio) / 2
    else:
        pic.crop_top = pic.crop_bottom = (1 - ratio / target) / 2
    return pic


def base(number, label, bg=BG, dark=False):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = rgb(bg)
    backgrounds = {
        2: "original-002.png",
        9: "original-004.png",
        10: "original-earth-127.png",
        11: "original-earth-147.png",
    }
    if number in backgrounds:
        picture(slide, backgrounds[number], 0, 0, 13.333333, 7.5)
        gradient = box(slide, 0, 0, 13.333333, 7.5, BG)
        fill = gradient.fill
        fill.gradient()
        stops = fill.gradient_stops
        for stop, opacity in [(stops[0], 98000), (stops[1], 12000)]:
            stop.color.rgb = rgb(BG)
            alpha = OxmlElement("a:alpha")
            alpha.set("val", str(opacity))
            stop._gs.find(
                "{http://schemas.openxmlformats.org/drawingml/2006/main}srgbClr"
            ).append(alpha)
        fill.gradient_angle = 0
    color = DARK if dark else MUTED
    text(slide, label.upper(), 0.60, 0.36, 11.6, 0.27, 11, color, True)
    line(slide, 0.60, 6.98, 12.72, 6.98, "35515F" if dark else "26384C", 0.8)
    text(slide, "TWINNAUTA  /  NASA SPACE APPS 2026", 0.60, 7.10, 9, 0.22, 9, color)
    if number in backgrounds or number in (1, 11):
        text(
            slide,
            "Conceptual illustration",
            9.4,
            7.11,
            2.5,
            0.22,
            8,
            color,
            align=PP_ALIGN.RIGHT,
        )
    text(
        slide, f"{number:02d}", 12.12, 7.08, 0.6, 0.25, 11, color, True, PP_ALIGN.RIGHT
    )
    if number <= len(NOTES):
        sec, title, speech = NOTES[number - 1]
        slide.notes_slide.notes_text_frame.text = (
            f"{title}\nSuggested time: {sec} seconds\n\n{speech}"
        )
    return slide


def tag(slide, content, x, y, w, color=CYAN, bg=PANEL):
    box(slide, x, y, w, 0.40, bg, color, True)
    text(slide, content, x + 0.13, y + 0.08, w - 0.26, 0.23, 10, color, True)


def source(slide, content, key, y=6.56, color=MUTED):
    text(slide, content, 0.62, y, 12.0, 0.28, 10, color, url=SOURCES[key])


prs = Presentation()
prs.slide_width = Inches(13.333333)
prs.slide_height = Inches(7.5)
prs.core_properties.title = "TwinNauta - From indicators to the next check"
prs.core_properties.subject = "Five-minute pitch - NASA Space Apps 2026"
prs.core_properties.author = "TwinNauta Team"

# 1: Original cover content in the current typography and palette.
s = base(1, "NASA Space Apps Challenge 2026")
picture(s, "original-000.png", 7.25, 0.76, 5.47, 6.10)
text(s, "TwinNauta", 0.62, 2.15, 7.6, 1.22, 66, bold=True)
text(
    s,
    "Digital twin and decision support for\nhealth monitoring on long-duration\nspace missions.",
    0.69,
    3.88,
    7.0,
    1.65,
    23,
)
line(s, 0.70, 6.02, 1.75, 6.02, CYAN, 2.5)
text(s, "Research prototype", 0.70, 6.40, 6.0, 0.32, 14, CYAN)

# 2: Challenge.
s = base(2, "The challenge")
text(
    s, "The body changes.\nThe mission continues.", 0.62, 1.15, 7.1, 2.1, 47, bold=True
)
text(
    s,
    "An indicator needs context\nto guide the next step.",
    0.66,
    3.7,
    6.7,
    1.2,
    29,
    CYAN,
    True,
)
for i, (a, b) in enumerate(
    [
        ("CHANGE", "The body adapts"),
        ("CONTEXT", "Data may be missing"),
        ("AUTONOMY", "Know what to check next"),
    ]
):
    x = 0.65 + i * 4.18
    line(s, x, 5.72, x + 3.6, 5.72, "34536B")
    text(s, a, x, 5.92, 3.6, 0.32, 13, CYAN, True)
    text(s, b, x, 6.34, 3.7, 0.4, 17)

# 3: Concept map of existing NASA capabilities and the proposed contribution.
s = base(3, "Concept map / research references, not software integration")
text(s, "NASA already simulates\nthe human body.", 0.62, 1.02, 12.0, 1.9, 53, bold=True)
for i, (name, description, status, key) in enumerate(
    [
        ("DAS", "Biomechanical simulation", "Research tool", "DAS"),
        ("HDTP", "Human digital twins", "Technology project", "HDTP"),
        ("CMO-DA", "Clinical decision support", "Proofs of concept", "CMO"),
    ]
):
    x = 0.66 + i * 4.18
    line(s, x + 1.83, 5.05, 6.67, 5.57, "355C72", 1.5)
    box(s, x, 3.25, 3.67, 1.8, PANEL, "294357", True)
    text(s, name, x + 0.20, 3.48, 3.27, 0.50, 25, CYAN, True, url=SOURCES[key])
    text(s, description, x + 0.20, 4.12, 3.27, 0.60, 18, bold=True)
    text(s, status, x + 0.20, 4.74, 3.27, 0.26, 11, MUTED)
text(
    s,
    "Open publications and research findings",
    3.42,
    5.58,
    6.5,
    0.36,
    14,
    MUTED,
    align=PP_ALIGN.CENTER,
)
box(s, 4.52, 6.02, 4.30, 0.45, CYAN, radius=True)
text(
    s,
    "TwinNauta · context and sources",
    4.65,
    6.10,
    4.04,
    0.29,
    15,
    DARK,
    True,
    PP_ALIGN.CENTER,
)
text(
    s,
    "A map of research references; it does not represent a software connection to NASA.",
    0.68,
    6.65,
    12,
    0.25,
    11,
    MUTED,
)

# 4: A flow map linking the three views to the human decision.
s = base(4, "Journey map / from data to follow-up", bg=CYAN, dark=True)
text(s, "Three questions.\nOne next step.", 0.62, 1.0, 11.9, 1.75, 53, DARK, True)
for i, (number, title, detail) in enumerate(
    [
        ("01", "What do we know?", "Data and quality"),
        ("02", "What could\nhappen?", "Implications and limits"),
        ("03", "What should\nwe check?", "Evidence-informed steps"),
    ]
):
    x = 0.66 + i * 4.18
    box(s, x, 3.36, 3.66, 1.78, DARK, radius=True)
    text(s, number, x + 0.20, 3.54, 3.26, 0.28, 13, CYAN, True)
    text(s, title, x + 0.20, 3.90, 3.26, 0.70, 20, INK, True)
    text(s, detail, x + 0.20, 4.69, 3.26, 0.30, 14, MUTED)
    line(s, x + 1.83, 5.14, 6.67, 5.70, DARK, 1.5)
    if i < 2:
        arrow = s.shapes.add_shape(
            MSO_SHAPE.RIGHT_ARROW,
            Inches(x + 3.77),
            Inches(4.07),
            Inches(0.28),
            Inches(0.24),
        )
        arrow.fill.solid()
        arrow.fill.fore_color.rgb = rgb(DARK)
        arrow.line.fill.background()
box(s, 4.50, 5.75, 4.34, 0.57, DARK, radius=True)
text(s, "HUMAN DECISION", 4.66, 5.88, 4.02, 0.32, 18, INK, True, PP_ALIGN.CENTER)
text(
    s,
    "Select a region → understand → explore the evidence",
    0.69,
    6.56,
    12,
    0.30,
    15,
    DARK,
)

# 5: An Ishikawa-style checklist, not a physiological causal model.
s = base(5, "One situation / a synthetic case")
tag(s, "DAY 10 / QUADRICEPS", 0.68, 1.0, 3.05)
text(s, "Did they skip training?", 0.62, 1.62, 11.9, 0.98, 56, bold=True)
text(s, "Or was it not recorded?", 0.62, 2.65, 12.0, 0.88, 40, CYAN, True)
text(
    s,
    "Ishikawa · questions to organize uncertainty",
    0.70,
    3.68,
    12,
    0.35,
    16,
    MUTED,
)
line(s, 1.00, 5.26, 10.08, 5.26, CYAN, 2.4)
for a, b, c, d in [
    (3.0, 4.90, 4.2, 5.26),
    (5.2, 5.26, 4.1, 5.90),
    (7.1, 4.90, 8.2, 5.26),
    (9.2, 5.26, 8.1, 5.90),
]:
    line(s, a, b, c, d, "6D94AD", 1.6)
for x, y, title, question in [
    (1.25, 4.12, "MEASUREMENTS", "Value and baseline available?"),
    (5.88, 4.12, "RECORDS", "Was the session recorded?"),
    (2.96, 5.94, "PROTOCOL", "Are the methods comparable?"),
    (7.30, 5.94, "RESOURCES", "Is equipment available?"),
]:
    text(s, title, x, y, 3.10, 0.30, 14, CYAN, True)
    text(s, question, x, y + 0.33, 3.10, 0.32, 13)
box(s, 10.10, 4.76, 2.58, 1.02, PANEL, CYAN, True)
text(s, "CONFIRM\nTHE RECORD", 10.28, 4.97, 2.22, 0.67, 16, INK, True, PP_ALIGN.CENTER)
text(
    s,
    "Information checks, not established medical causes.",
    0.70,
    6.69,
    12,
    0.24,
    11,
    MUTED,
)

# 6: Semantic links between measurements, literature and the next check.
s = base(6, "Semantic map / data, interpretation and supporting evidence")
text(s, "Every summary leads\nback to its source.", 0.62, 1.0, 12.0, 1.8, 50, bold=True)
for y in [3.43, 4.56, 5.69]:
    line(s, 3.74, y + 0.40, 4.60, 4.72, "355C72", 1.7)
for y in [3.43, 4.56, 5.69]:
    line(s, 7.66, 4.72, 8.60, y + 0.40, "355C72", 1.7)
for y, title, detail in [
    (3.43, "OBSERVATIONS", "Area · torque"),
    (4.56, "RECORDS AND QUALITY", "Sessions · missing data"),
]:
    box(s, 0.69, y, 3.05, 0.81, PANEL, "294357", True)
    text(s, title, 0.86, y + 0.11, 2.71, 0.27, 12, CYAN, True)
    text(s, detail, 0.86, y + 0.44, 2.71, 0.30, 15)
box(s, 0.69, 5.69, 3.05, 0.81, PANEL, "294357", True)
text(s, "LITERATURE TO REVIEW", 0.86, 5.80, 2.71, 0.25, 11, CYAN, True)
text(s, "Scott 2020", 0.86, 6.12, 1.28, 0.26, 12, INK, True, url=SOURCES["SCOTT"])
text(s, "SPRINT 2024", 2.16, 6.12, 1.45, 0.26, 12, INK, True, url=SOURCES["SPRINT"])
box(s, 4.60, 4.13, 3.06, 1.18, CYAN, radius=True)
text(s, "CASE + EVIDENCE", 4.76, 4.30, 2.74, 0.31, 14, DARK, True, PP_ALIGN.CENTER)
text(
    s, "Explanation and limits", 4.76, 4.78, 2.74, 0.31, 15, DARK, True, PP_ALIGN.CENTER
)
for y, title, detail in [
    (3.43, "OPEN THE SOURCE", "Original and excerpts"),
    (4.56, "REVIEW THE CONTEXT", "Population · method · setting"),
    (5.69, "CHOOSE THE NEXT CHECK", "Next step and human responsibility"),
]:
    box(s, 8.60, y, 4.03, 0.81, PANEL, "294357", True)
    text(s, title, 8.77, y + 0.11, 3.69, 0.27, 12, CYAN, True)
    text(s, detail, 8.77, y + 0.44, 3.69, 0.30, 14)
text(
    s,
    "Conceptual links for exploration; they do not establish causation or individual applicability.",
    0.70,
    6.72,
    12,
    0.22,
    10,
    MUTED,
)

# 7: Current product, not validated outcomes.
s = base(7, "What exists today")
text(
    s,
    "A focused scope.\nA working prototype.",
    0.62,
    1.0,
    12,
    1.8,
    45,
    bold=True,
)
for i, (n, label) in enumerate(
    [
        ("1", "quadriceps module"),
        ("27", "candidate publications"),
        ("26", "prepared summaries"),
    ]
):
    x = 0.68 + i * 4.2
    text(s, n, x, 3.12, 3.7, 1.32, 86, CYAN, True)
    text(s, label, x, 4.63, 3.8, 0.85, 20, bold=True)
text(s, "Muscle area  ·  Torque  ·  Exercise", 0.70, 5.75, 12, 0.47, 25, bold=True)
text(
    s,
    "Terrestrial heart-rate demo. Synthetic case. Scientific review pending.",
    0.70,
    6.45,
    12,
    0.38,
    13,
    MUTED,
)

# 8: Heart-rate monitoring, with an explicitly illustrative signal.
s = base(8, "Telemetry / heart rate in beats per minute")
text(
    s,
    "Heart rate.\nContext before alerts.",
    0.62,
    0.95,
    12.0,
    1.65,
    43,
    bold=True,
)
text(
    s,
    "A real terrestrial exercise source, separate from the virtual case.",
    0.70,
    2.66,
    12.0,
    0.43,
    18,
    MUTED,
)
box(s, 0.68, 3.38, 11.97, 1.90, PANEL, "294357", True)
text(
    s,
    "Illustrative schematic · not a reproduction of a recording",
    0.93,
    3.57,
    10.8,
    0.33,
    13,
    MUTED,
)
trace = [
    (0.98, 4.91),
    (1.7, 4.88),
    (2.3, 4.69),
    (2.9, 4.76),
    (3.6, 4.49),
    (4.25, 4.39),
    (4.8, 4.44),
    (5.3, 4.25),
    None,
    (6.7, 4.15),
    (7.3, 4.10),
    (7.9, 4.28),
    (8.5, 4.22),
    (9.1, 4.53),
    (9.8, 4.62),
    (10.5, 4.68),
    (11.25, 4.80),
    (12.2, 4.85),
]
for first, second in pairwise(trace):
    if first is not None and second is not None:
        line(s, *first, *second, CYAN, 3)
text(s, "missing reading", 5.45, 4.57, 1.5, 0.33, 12, LIME, True)
text(s, "602", 0.73, 5.61, 2.0, 0.70, 36, CYAN, True)
text(s, "audited samples", 2.24, 5.88, 4.0, 0.4, 16)
text(s, "2", 7.02, 5.61, 1.0, 0.70, 36, LIME, True)
text(s, "with no heart-rate value", 7.95, 5.88, 4.7, 0.40, 16)
source(
    s,
    "Mongin, García Romero and Alvero Cruz · PhysioNet, v1.0.1 (2021) · DOI 10.13026/7ezk-j442.",
    "PHYSIONET",
    6.60,
)

# 8: Local preparation/reading.
s = base(9, "Designed for autonomy")
text(s, "Prepare\non Earth.", 0.62, 1.11, 6.4, 1.9, 53, bold=True)
text(s, "Consult\non board.", 0.62, 3.35, 6.3, 1.8, 53, CYAN, True)
for i, (name, detail) in enumerate(
    [
        ("PREPARE", "Prepare explanations in advance"),
        ("STORE", "Content and versions"),
        ("CONSULT", "Read from the local database"),
    ]
):
    x = 0.68 + i * 4.18
    box(s, x, 5.64, 3.65, 0.70, PANEL, "294357", True)
    text(s, name, x + 0.15, 5.73, 3.35, 0.23, 11, CYAN, True)
    text(s, detail, x + 0.15, 6.04, 3.35, 0.24, 12)
    if i < 2:
        arrow = s.shapes.add_shape(
            MSO_SHAPE.RIGHT_ARROW,
            Inches(x + 3.78),
            Inches(5.88),
            Inches(0.26),
            Inches(0.20),
        )
        arrow.fill.solid()
        arrow.fill.fore_color.rgb = rgb(CYAN)
        arrow.line.fill.background()
text(
    s,
    "Today: a local database. Still to verify: the complete offline flow.",
    0.68,
    6.55,
    11.9,
    0.3,
    12,
    MUTED,
)

# 10: Original space-to-hospital slide; preserve its distinctions and evidence.
s = base(10, "Space research / health on Earth")
picture(s, "original-person-128.png", 7.20, 1.66, 3.86, 3.80)
picture(s, "original-person-149.png", 8.73, 3.68, 4.08, 3.19)
text(s, "FROM SPACE", 0.62, 0.94, 8.2, 0.72, 42, bold=True)
text(s, "TO THE HOSPITAL", 0.62, 1.73, 8.2, 0.72, 42, CYAN, True)
text(
    s,
    "A shared physiological challenge:\ndifferent contexts, some consequences of disuse\nand deconditioning may overlap.",
    0.70,
    2.66,
    7.80,
    0.88,
    17,
)
for y, lead, body in [
    (3.73, "Reduced loading and muscle activity", "loss of strength and performance"),
    (
        4.40,
        "Bed rest and immobility",
        "deconditioning and difficulty regaining walking ability",
    ),
]:
    line(s, 0.71, y, 0.71, y + 0.48, CYAN, 2)
    text(s, lead, 0.91, y - 0.02, 7.05, 0.28, 16, CYAN, True)
    text(s, body, 0.91, y + 0.28, 7.05, 0.35, 15)
line(s, 0.71, 5.12, 0.71, 5.71, CYAN, 2)
text(
    s,
    "Hospital immobility, together with surgery\nand acute illness, can increase\nthromboembolic risk.",
    0.91,
    5.08,
    7.03,
    0.76,
    15,
)
text(
    s,
    "Microgravity adds its own changes, such as fluid shifts,\nwhich are not equivalent to bed rest.",
    0.71,
    5.99,
    8.00,
    0.48,
    12,
    MUTED,
)
text(
    s,
    "Evidence: Mulavara et al., 2018, compared astronauts after 6-month missions\nwith participants undergoing 70 days of bed rest at a −6° head-down tilt.",
    0.71,
    6.52,
    10.0,
    0.32,
    10,
    MUTED,
    url=SOURCES["MULAVARA"],
)
text(
    s,
    "Thromboembolic risk: CDC",
    10.08,
    6.54,
    2.60,
    0.35,
    9,
    MUTED,
    url=SOURCES["CDC_VTE"],
)

# 11: Original regional proposal, framed as a future pilot rather than a current feature.
s = base(11, "Future Earth application / proposed pilot")
picture(s, "original-person-148.png", 7.31, 2.20, 3.18, 4.45)
picture(s, "original-person-149.png", 9.02, 3.67, 3.83, 3.20)
text(s, "TwinNauta", 0.62, 0.94, 8.0, 0.74, 43, bold=True)
text(s, "in Arequipa", 0.62, 1.75, 8.0, 0.74, 43, CYAN, True)
text(
    s,
    "From space research to patient recovery\nin our hospitals.",
    0.71,
    2.68,
    7.20,
    0.68,
    17,
)
text(s, "PROPOSED SCOPE", 0.72, 3.41, 7.0, 0.28, 11, CYAN, True)
items = [
    "Monitor activity, mobility and functional progress\nusing contextualized clinical indicators.",
    "Support progressive exercise and follow-up of strength\nand muscle performance under clinical protocols.",
    "Identify trends and flag changes or inactivity\nthat require assessment by healthcare professionals.",
    "Support, without replacing, clinical assessment of\nthromboembolic risk. No diagnosis or exclusion of thrombosis.",
]
for i, content in enumerate(items):
    y = 3.84 + i * 0.56
    line(s, 0.72, y, 0.72, y + 0.40, CYAN, 1.6)
    text(s, content, 0.91, y - 0.01, 7.06, 0.49, 14)
text(
    s,
    "REGIONAL GOAL: explore a pilot in hospital services in Arequipa, validating\nsafety, usability and clinical usefulness before implementation.",
    0.73,
    6.16,
    10.3,
    0.40,
    11,
    CYAN,
)
text(
    s,
    "EVIDENCE: Padilha et al., 2026, a meta-analysis of hospitalization,\nbed rest and spaceflight; PMID 41983453.",
    0.73,
    6.58,
    10.3,
    0.29,
    9,
    MUTED,
    url=SOURCES["PADILHA"],
)

# Appendix: formal sources, outside the five-minute pitch.
s = base(12, "Appendix / NASA sources")
text(s, "Building on existing work", 0.65, 0.94, 12, 1.0, 40, bold=True)
for i, (title, desc, key) in enumerate(
    [
        (
            "DAS · NASA, 2023",
            "Biomechanical research tool; not a complete clinical digital twin.",
            "DAS",
        ),
        (
            "HDTP · NASA TechPort, project 154412",
            "Human digital twin project; not evidence of clinical deployment in flight.",
            "HDTP",
        ),
        (
            "CMO-DA · NASA NTRS, 2026",
            "Conference document, ID 20260001797; describes proofs of concept.",
            "CMO",
        ),
    ]
):
    y = 2.15 + i * 1.34
    text(s, title, 0.68, y, 12, 0.48, 22, CYAN, True, url=SOURCES[key])
    text(s, desc, 0.68, y + 0.51, 12, 0.40, 16)
    text(s, SOURCES[key], 0.68, y + 0.94, 12, 0.30, 10, MUTED, url=SOURCES[key])
text(
    s,
    "TwinNauta does not claim interoperability with these systems or NASA endorsement.",
    0.68,
    6.55,
    12,
    0.30,
    12,
    MUTED,
)

s = base(13, "Appendix / scientific sources")
text(s, "Published data, with limits", 0.65, 0.94, 12, 1.0, 38, bold=True)
for i, (title, desc, key) in enumerate(
    [
        (
            "Scott et al. · Critical Care Explorations, 2020",
            "Disuse-Induced Muscle Loss and Rehabilitation: The NASA Bed Rest Study.\nNine participants; experimental bed rest. Muscle-area references.",
            "SCOTT",
        ),
        (
            "Trappe et al. · Journal of Applied Physiology, 2024",
            "NASA SPRINT exercise program efficacy… 70 days of simulated microgravity.\nBed-rest protocol; muscle size and function.",
            "SPRINT",
        ),
        (
            "Mulavara et al. · Medicine & Science in Sports & Exercise, 2018",
            "Physiological and Functional Alterations after Spaceflight and Bed Rest.\nComparable tests; spaceflight and experimental bed rest of different durations.",
            "MULAVARA",
        ),
    ]
):
    y = 2.0 + i * 1.48
    text(s, title, 0.68, y, 12, 0.48, 20, CYAN, True, url=SOURCES[key])
    text(s, desc, 0.68, y + 0.49, 12, 0.68, 14)
    text(s, SOURCES[key], 0.68, y + 1.17, 12, 0.28, 11, MUTED, url=SOURCES[key])
text(
    s,
    "Bed rest ≠ spaceflight. Mass ≠ area ≠ torque. Cohorts may overlap.",
    0.68,
    6.65,
    12,
    0.24,
    11,
    MUTED,
)

s = base(14, "Appendix / data and prototype status")
text(s, "What we are using", 0.65, 0.94, 12, 0.9, 40, bold=True)
rows = [
    (
        "Future Earth application",
        "Padilha et al., 2026 · meta-analysis. Responses differ by setting; not proof of clinical equivalence.",
        "PADILHA",
    ),
    (
        "Heart-rate telemetry",
        "PhysioNet · treadmill exercise dataset, v1.0.1. Terrestrial data, separate from the virtual case.",
        "PHYSIONET",
    ),
    (
        "TwinNauta status",
        "Preliminary corpus: 27 candidates / 26 summaries. Synthetic case. Muscle model and scientific review pending.",
        None,
    ),
    (
        "Images and diagrams",
        "Team illustrations and AI-generated artwork. They do not document real patients, missions or outcomes.",
        None,
    ),
]
for i, (title, desc, key) in enumerate(rows):
    y = 2.05 + i * 1.12
    text(s, title, 0.70, y, 3.0, 0.7, 18, CYAN, True)
    text(s, desc, 3.9, y, 8.5, 0.73, 16)
    if key:
        text(s, SOURCES[key], 3.9, y + 0.75, 8.5, 0.25, 10, MUTED, url=SOURCES[key])
text(
    s,
    "Sources checked on 15 Nov 2026. Bibliographic support does not clinically validate the prototype.",
    0.70,
    6.65,
    12,
    0.23,
    10,
    MUTED,
)

deck_path = ROOT / "TwinNauta_pitch_EN.pptx"
prs.save(deck_path)
# Office uses theme colors for hyperlinks, including during PDF export.
with ZipFile(deck_path) as archive:
    entries = {name: archive.read(name) for name in archive.namelist()}
theme_path = "ppt/theme/theme1.xml"
theme = etree.fromstring(entries[theme_path])
namespaces = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main"}
for name in ("hlink", "folHlink"):
    color = theme.find(f".//a:clrScheme/a:{name}/a:srgbClr", namespaces)
    color.set("val", CYAN)
entries[theme_path] = etree.tostring(theme, xml_declaration=True, encoding="UTF-8")
with ZipFile(deck_path, "w", ZIP_DEFLATED) as archive:
    for name, content in entries.items():
        archive.writestr(name, content)

elapsed = 0
script = [
    "# TwinNauta: five-minute speaking guide",
    "",
    "Eleven main slides. Three source slides are provided separately and are not read during the pitch.",
    "",
    "Timing is a rehearsal guide, not a measured delivery duration.",
    "",
]
for number, (seconds, title, speech) in enumerate(NOTES, 1):
    start = f"{elapsed // 60}:{elapsed % 60:02d}"
    elapsed += seconds
    end = f"{elapsed // 60}:{elapsed % 60:02d}"
    script.extend([f"## {number}. {title} ({start}–{end})", "", speech, ""])
script.extend(
    [
        "## Short answers for questions",
        "",
        "- **Is this a validated human digital twin?** The prototype offers an anatomical representation and scientific context, not a validated individual predictive twin.",
        "- **Does it use NASA resources?** It uses open publications and findings from space research; it does not integrate DAS, HDTP or CMO-DA and has no NASA endorsement.",
        "- **Does it work offline?** Summaries and library content are stored locally. The complete offline flow remains to be verified; external originals require access or an authorized copy.",
        "- **Can it prescribe exercise?** No. Current steps are operational information checks. Clinical adaptations require review and validation.",
        "- **What needs validation?** Interpretation accuracy, applicability and user understanding, followed by usefulness in the intended setting.",
        "",
    ]
)
(ROOT / "pitch_script_5_minutes_EN.md").write_text("\n".join(script), encoding="utf-8")
print(
    f"Creado PPTX de {len(prs.slides)} diapositivas. Guion: {sum(len(n[2].split()) for n in NOTES)} palabras; pauta: {elapsed} s."
)
