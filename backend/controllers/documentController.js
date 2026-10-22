import Document from '../models/Document.js';

export const getDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const documents = await Document.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { title, category, fileName, fileSize, fileType, accessLevel, description, uploadedBy } = req.body;

    if (!title || !fileName) {
      return res.status(400).json({ success: false, message: 'Document title and file name are required' });
    }

    const count = await Document.countDocuments();
    const docId = `DOC-${1000 + count + 1}`;

    const doc = new Document({
      docId,
      title: title.trim(),
      category: category || 'Company Policies',
      fileName: fileName.trim(),
      fileSize: fileSize || '1.5 MB',
      fileType: fileType || 'PDF',
      uploadDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploadedBy: uploadedBy || 'Priya Sharma (HR Director)',
      accessLevel: accessLevel || 'All Employees',
      description: description || ''
    });

    await doc.save();

    res.status(201).json({
      success: true,
      message: 'Document published to corporate repository',
      document: doc
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({
      success: true,
      message: 'Document removed from corporate repository'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const recordDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({
      success: true,
      downloadCount: doc.downloadCount
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
