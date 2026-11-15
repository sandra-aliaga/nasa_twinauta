# TwinNauta: five-minute speaking guide

Eleven main slides. Three source slides are provided separately and are not read during the pitch.

Timing is a rehearsal guide, not a measured delivery duration.

## 1. TwinNauta (0:00–0:15)

We are TwinNauta. Our proposal brings together digital twin concepts and decision support for health monitoring on long-duration space missions. Today we present a research prototype that connects health indicators, scientific evidence and the next information to check.

## 2. The body changes. The mission continues. (0:15–0:33)

The challenge is to gather indicators so astronauts can assess their health and act. We start with muscle monitoring and a separate heart-rate demonstration. The goal is to interpret available information and recognize when something important is missing.

## 3. NASA already simulates the human body. (0:33–0:56)

NASA already uses biomechanical simulation and develops human digital twin and decision-support projects. We build on published research. Our proposed contribution is a way to connect indicators, context and sources. TwinNauta does not integrate DAS, HDTP or CMO-DA, and does not claim to have invented digital twins.

## 4. Three questions. One next step. (0:56–1:20)

Select a body region and explore three questions: what do we know, what implications does the literature describe, and what should we check next? Start with a summary, then explore measurements, papers and their links. Evidence from another population or protocol does not automatically apply to this case.

## 5. Did they skip training? Or was it not recorded? (1:20–1:46)

On day ten of our synthetic case, an exercise session is not recorded and a torque assessment is missing. This does not demonstrate non-adherence or muscle loss. The next step is to confirm what information exists. Our diagram organizes questions about measurements, records, methods and resources, rather than assigning a medical cause.

## 6. Every summary leads back to its source. (1:46–2:13)

The library connects paper records, prepared summaries and excerpts from abstracts. Population, methods, environment and limitations affect interpretation. Scott and SPRINT come from the same experimental program, so they are not independent validations. The map connects observations and literature with an explanation, its limits and a next check; its links do not establish causation.

## 7. A focused scope. A working prototype. (2:13–2:37)

We currently have one quadriceps module, twenty-seven candidate publications and twenty-six prepared summaries. The flow connects assessment, library and case explanations. We track muscle area, knee-extension torque and exercise records. The case is synthetic; the predictive muscle model and scientific review remain pending. This demonstrates integration, not clinical effectiveness.

## 8. Heart rate. Context before alerts. (2:37–3:02)

Heart rate adds a real terrestrial exercise recording from PhysioNet, kept separate from the virtual astronaut. The application plays time windows and preserves missing readings without inventing values. This slide uses an illustrative schematic, not the recording. It demonstrates monitoring and data quality, without converting heart-rate variation into a diagnosis or an estimate of muscle loss.

## 9. Prepare on Earth. Consult on board. (3:02–3:22)

We separate preparation from consultation. Explanations are generated beforehand and stored; opening them does not trigger another AI request. Today they are read from the local database. We still need to verify the complete offline flow, including access to documents, before claiming full mission autonomy.

## 10. From space to the hospital (3:22–4:07)

The original proposal connects space and hospital settings: some consequences of disuse and deconditioning may overlap, although the environments differ. Mulavara compared tests after six-month space missions and seventy days of experimental bed rest. Hospital immobility, together with surgery or acute illness, can also increase thromboembolic risk; that statement has a separate CDC source and is not a result of our muscle module. Microgravity adds its own changes, including fluid shifts. We therefore keep the analogy and its limits visible rather than transferring spaceflight parameters directly to patients.

## 11. TwinNauta in Arequipa (4:07–5:00)

We retain the original regional goal: explore a hospital pilot in Arequipa. Its proposed scope includes contextualizing activity, mobility and functional progress; supporting exercise follow-up under clinical protocols; and flagging changes for professional assessment. Supporting clinical assessment of thromboembolic risk would be a future function, without diagnosing or ruling out thrombosis. These are proposed applications, not an operating hospital service. The regional goal is to assess safety, usability and clinical usefulness before implementation, with healthcare professionals involved. The research provides context for that goal, not proof that this prototype is clinically validated.

## Short answers for questions

- **Is this a validated human digital twin?** The prototype offers an anatomical representation and scientific context, not a validated individual predictive twin.
- **Does it use NASA resources?** It uses open publications and findings from space research; it does not integrate DAS, HDTP or CMO-DA and has no NASA endorsement.
- **Does it work offline?** Summaries and library content are stored locally. The complete offline flow remains to be verified; external originals require access or an authorized copy.
- **Can it prescribe exercise?** No. Current steps are operational information checks. Clinical adaptations require review and validation.
- **What needs validation?** Interpretation accuracy, applicability and user understanding, followed by usefulness in the intended setting.
