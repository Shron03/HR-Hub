import OnboardingCase from '../models/OnboardingCase.js';
import Notification from '../models/Notification.js';

export const getOnboardingCases = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type && type !== 'All') filter.type = type;
    if (status && status !== 'All') filter.status = status;

    const cases = await OnboardingCase.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cases.length,
      cases
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOnboardingCase = async (req, res) => {
  try {
    const { type, candidateName, employeeId, role, department, managerName, targetDate, notes } = req.body;

    if (!candidateName || !role || !department || !targetDate) {
      return res.status(400).json({ success: false, message: 'Candidate name, role, department, and target date are required' });
    }

    const count = await OnboardingCase.countDocuments();
    const prefix = type === 'Offboarding' ? 'OFF' : 'ONB';
    const caseId = `${prefix}-${1000 + count + 1}`;

    const defaultChecklist = type === 'Offboarding'
      ? [
          { taskName: 'Resignation Notice & Transition Approval', category: 'Documentation', isCompleted: true },
          { taskName: 'Knowledge Transfer (KT) Sign-off with Lead', category: 'Team KT', isCompleted: false },
          { taskName: 'Asset Recovery (MacBook, Charger, Security ID)', category: 'IT Assets', isCompleted: false },
          { taskName: 'Access Revocation (GitHub, AWS, Jira, Slack)', category: 'IT Assets', isCompleted: false },
          { taskName: 'HR Exit Interview & Feedback Documentation', category: 'Exit Clearance', isCompleted: false },
          { taskName: 'Full & Final (FnF) Settlement Processing', category: 'Finance Settlement', isCompleted: false }
        ]
      : [
          { taskName: 'Offer Letter Acceptance & Signed Contract', category: 'Documentation', isCompleted: true },
          { taskName: 'Identity & Address Proof Verification (Aadhaar/PAN)', category: 'Documentation', isCompleted: true },
          { taskName: 'Corporate Workstation & Access Provisioning', category: 'IT Assets', isCompleted: false },
          { taskName: 'Company Culture & Values HR Induction', category: 'HR Induction', isCompleted: false },
          { taskName: 'Departmental Onboarding & Peer Buddy Assignment', category: 'Team KT', isCompleted: false },
          { taskName: 'Probation Milestone & 30-Day Check-in Scheduled', category: 'HR Induction', isCompleted: false }
        ];

    const completedCount = defaultChecklist.filter(i => i.isCompleted).length;
    const progressPercent = Math.round((completedCount / defaultChecklist.length) * 100);

    const newCase = new OnboardingCase({
      caseId,
      type: type || 'Onboarding',
      candidateName: candidateName.trim(),
      employeeId: employeeId || '',
      role: role.trim(),
      department,
      managerName: managerName || 'Rajesh Verma',
      targetDate,
      status: 'In Progress',
      progressPercent,
      checklist: defaultChecklist,
      notes: notes || ''
    });

    await newCase.save();

    await Notification.create({
      title: `${newCase.type} Process Initiated`,
      message: `${newCase.type} workflow created for ${newCase.candidateName} (${newCase.role}, ${newCase.department}).`,
      category: 'system',
      recipientRole: 'HR Director',
      actionLink: 'onboarding-offboarding'
    });

    res.status(201).json({
      success: true,
      message: `${newCase.type} case initiated successfully`,
      case: newCase
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const toggleChecklistTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;

    const currentCase = await OnboardingCase.findById(id);
    if (!currentCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const task = currentCase.checklist.id(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Checklist task not found' });
    }

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : null;

    const completedCount = currentCase.checklist.filter(i => i.isCompleted).length;
    currentCase.progressPercent = Math.round((completedCount / currentCase.checklist.length) * 100);

    if (currentCase.progressPercent === 100) {
      currentCase.status = 'Completed';
    } else {
      currentCase.status = 'In Progress';
    }

    await currentCase.save();

    res.json({
      success: true,
      message: `Task "${task.taskName}" updated`,
      case: currentCase
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const currentCase = await OnboardingCase.findById(id);
    if (!currentCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (status) currentCase.status = status;
    if (notes !== undefined) currentCase.notes = notes;

    await currentCase.save();

    res.json({
      success: true,
      message: 'Case status updated',
      case: currentCase
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
