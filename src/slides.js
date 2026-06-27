// Lane themes match the swimlane integration-flow diagram.
export const LANES = {
  CMS: { code: 'CMS', name: 'Change Management System', color: '#0b4ea2', soft: '#eef4fc', icon: '👥' },
  ERA: { code: 'ERA', name: 'Engineering Requirements Application', color: '#1f7a3a', soft: '#eef8f1', icon: '📋' },
  DCR: { code: 'DCR', name: 'Design Change Request', color: '#e4571e', soft: '#fdf0e8', icon: '🛠️' },
  OMS: { code: 'OMS', name: 'Operations Management System', color: '#6b2fa0', soft: '#f4eefb', icon: '⚙️' },
}

// Scenario text is restricted to the final diagram path and the visible screenshots.
export const SLIDES = [
  {
    type: 'cover',
    lane: 'CMS',
    kicker: 'INTEGRATION FLOW IN ACTION',
    title: 'CMS ↔ ERA ↔ DCR ↔ OMS',
    subtitle: 'Corrective-action scenario based on the visible screenshots',
    scenario: 'CAR 14914 — Power Inlet',
    blurb: 'The visible case starts with CAR 14914 in CMS: during power-cord disconnection, the power fuse was disconnected from its place and one fuse was broken. The scenario follows the final diagram path from CMS change request and action assignment, into ERA requirements and subsystem design, then to OMS verification data and CMS closure.',
  },
  {
    type: 'tour',
    lane: 'OMS',
    focus: 'explore',
    title: 'Explore the full integration flow',
    note: 'Start with the full diagram: drag, zoom in/out, and fit all. Then continue to the screenshot scenario steps.'
  },
  {
    lane: 'CMS', step: 1,
    chapter: 'Change Management',
    title: 'Create the change request',
    image: 'images/02-car-management.jpeg',
    caption: 'CAR Management R&D — Corrective Action Request 14914',
    points: [
      ['CAR 14914', 'Requester: System Validation. Status: In-Process. Calculated status: In process - Tested.'],
      ['Request summary', 'During power cord disconnection, the power fuse was disconnected from its place and one of the fuses was broken.'],
      ['Case fields', 'Source: Improvement. Priority: High. Project: 1 - EZVent. Selected device: 025.'],
    ],
    mapsTo: 'Create Change Request → Investigation → Create Action',
  },
  {
    lane: 'CMS', step: 2,
    chapter: 'Change Management',
    title: 'Assign the action to Engineering',
    image: 'images/01-action-assignment.jpeg',
    caption: 'Action Assignment — Action 5150',
    points: [
      ['Action 5150', 'Assigned to Islam Mahmoud Ali Mohamed Shoeer in the System Engineering functional team.'],
      ['Action description', 'Review the mechanical design of the power inlet unit integration with the backcover, the power cable and the type of the power cable and its fixation.'],
      ['Visible impact', 'The screenshot shows Usability File and Risk Management File selected, with IFU written in the supporting field.'],
    ],
    mapsTo: 'Assign Action to Responsible Team → Is Action a Requirement?',
  },
  {
    lane: 'CMS', step: 3,
    chapter: 'Change Management',
    title: 'Record the action response',
    image: 'images/03-action-response.jpeg',
    caption: 'Action Response — feedback / objective evidence',
    points: [
      ['Fuse fixation', 'The response states that fuse fixation is secured by adding a cover with a screw fastener.'],
      ['Power cord handling', 'The response states that fixation allows access to fuse maintenance and prevents accidental disconnection of the power cord.'],
      ['Clamp update', 'A clamp is integrated into the patient handle to prevent unwanted motion of the power cord.'],
    ],
    mapsTo: 'Respond Action → send/update requirement path',
  },
  {
    lane: 'ERA', step: 4,
    chapter: 'Engineering Requirements',
    title: 'Open the project in ERA',
    image: 'images/04-projects.jpeg',
    caption: 'ERA Projects — EZVent M-202',
    points: [
      ['Project', 'EZVent M-202 is selected in the project list.'],
      ['Project type', 'Research & Development Project.'],
      ['Visible modules', 'Project PRD, Conflict Resolving, Allocations, Sub-System Req, Sub-System Design, Subsystem Design Verification, Compliance, Documentation, and Traceability Matrix.'],
    ],
    mapsTo: 'Rewrite Action as CAR Requirement → Conflict Resolution → Risk Assessment / Cyber security',
  },
  {
    lane: 'ERA', step: 5,
    chapter: 'Engineering Requirements',
    title: 'Place the CAR under requirements',
    image: 'images/05-subsystem-req.jpeg',
    caption: 'Electrical Sub-System Requirements — CAR Requirements area',
    points: [
      ['Allocated requirements', 'Total: 846. Linked: 505. New: 341.'],
      ['Requirement groups', 'PRD Requirements, Standards Requirements, Usability Requirements, Sub-Systems Requirements, and CAR Requirements are visible.'],
      ['SYSR pane', 'ESSR/MSSR and Design Elements are visible in the navigation pane.'],
    ],
    mapsTo: 'Subsystem Requirement preparation',
  },
  {
    lane: 'ERA', step: 6,
    chapter: 'Engineering Requirements',
    title: 'Select the Power Inlet requirement',
    image: 'images/06-power-inlet.jpeg',
    caption: 'Component 02.02.01.02 — Power Inlet',
    points: [
      ['Component', 'Power Management → AC to DC Power Management → Power Entry → 02.02.01.02 Power Inlet.'],
      ['Requirement description', 'It is required to select a mains power inlet socket which the power cord will be connected to.'],
      ['Visible specs', '14.01 locked fuse holder for at least a single fuse. 14.02 fuse rating calculated according to product rated current and main power supply rating.'],
    ],
    mapsTo: 'Subsystem Requirement → Requirement Status = In Design',
  },
  {
    lane: 'ERA', step: 7,
    chapter: 'Engineering Requirements',
    title: 'Update subsystem design',
    image: 'images/08-subsystem-design.jpeg',
    caption: 'Sub-System Design / HDD — Power Inlet',
    points: [
      ['HDD view', 'The HDD navigation pane shows 02.02.01.02 Power Inlet selected.'],
      ['Design option', 'Option 1 is visible for the Power Inlet design.'],
      ['Visible design specs', 'Earth terminal impedance shall not exceed 100 mOhms, locked fuse holder, fuse rating, and panel-mounted C14 plug are visible.'],
    ],
    mapsTo: 'Subsystem Design → Subsystem Design Risk Analysis / Cyber security → Related DCR',
  },
  {
    lane: 'ERA', step: 8,
    chapter: 'Verification',
    title: 'Move to subsystem design verification',
    image: 'images/09-verification.jpeg',
    caption: 'Sub-Systems Design Verification — Hardware Verification',
    points: [
      ['Project details', 'EZVent M-202 is shown as an active project.'],
      ['Owners shown', 'Project Manager and Technical Lead are visible in the project details header.'],
      ['Verification type', 'Hardware Verification is listed.'],
    ],
    mapsTo: 'Retrieve Verification Data from OMS → Subsystem Design Verification → Verification Passed?',
  },
  { type: 'tour', lane: 'OMS', focus: 'explore', title: 'Explore the full integration flow', note: 'Free navigation mode: drag the diagram, zoom in/out, and fit all whenever needed.' },
]
