import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';

export const getTickets = async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const { status, category } = req.query;
    const filter = { workspaceId };

    // IDOR Protection: If caller is regular employee, restrict strictly to their own tickets
    if (req.user?.role === 'Employee') {
      filter.employeeId = req.user.employeeId;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const { employeeName, department, category, priority, subject, description } = req.body;
    let employeeId = req.body.employeeId;

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required' });
    }

    // Force employeeId to the caller's verified employeeId if regular Employee
    if (req.user?.role === 'Employee') {
      employeeId = req.user.employeeId;
    }

    const count = await Ticket.countDocuments({ workspaceId });
    const ticketId = `TCK-${1000 + count + 1}`;

    const ticket = new Ticket({
      workspaceId,
      ticketId,
      employeeId: employeeId || 'EMP-1001',
      employeeName: employeeName || 'Employee',
      department: department || 'Engineering',
      category: category || 'General Administrative',
      priority: priority || 'Medium',
      subject: subject.trim(),
      description: description.trim(),
      status: 'Open'
    });

    await ticket.save();

    // Notify HR Director in this workspace
    await Notification.create({
      workspaceId,
      title: 'New HR Help Desk Ticket Raised',
      message: `${ticket.employeeName} (${ticket.department}) raised ticket #${ticketId}: "${ticket.subject}" [Priority: ${ticket.priority}].`,
      category: 'system',
      recipientRole: 'HR Director',
      actionLink: 'helpdesk'
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket successfully dispatched to HR Operations',
      ticket
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.workspaceId;
    const { status, resolutionNote, callerName } = req.body;

    const ticket = await Ticket.findOne({ _id: id, workspaceId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (resolutionNote !== undefined) ticket.resolutionNote = resolutionNote.trim();

    if (resolutionNote && callerName) {
      ticket.replies.push({
        sender: callerName || 'HR Operations',
        senderRole: req.user?.role || 'HR Director',
        message: resolutionNote.trim(),
        createdAt: new Date()
      });
    }

    await ticket.save();

    // Notify the employee who created the ticket in this workspace
    await Notification.create({
      workspaceId,
      title: `HR Ticket #${ticket.ticketId} Updated`,
      message: `Your ticket status is now "${ticket.status}". ${resolutionNote ? `Resolution Note: ${resolutionNote}` : ''}`,
      category: 'system',
      recipientRole: 'Employee',
      recipientEmployeeId: ticket.employeeId,
      actionLink: 'emp-hr-tickets'
    });

    res.json({
      success: true,
      message: 'Ticket status updated and resolution archived',
      ticket
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addTicketReply = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.workspaceId;
    const { sender, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
    }

    const ticket = await Ticket.findOne({ _id: id, workspaceId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role check: HR & Managers can reply to all; regular Employees can only reply to their own tickets
    if (req.user?.role === 'Employee' && ticket.employeeId !== req.user.employeeId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only reply to tickets created by you.'
      });
    }

    ticket.replies.push({
      sender: sender || req.user?.email || 'User',
      senderRole: req.user?.role || 'Employee',
      message: message.trim(),
      createdAt: new Date()
    });

    await ticket.save();

    res.json({
      success: true,
      message: 'Reply posted to ticket thread',
      ticket
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
