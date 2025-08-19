module.exports = {
  ok: (res, data, meta) => res.status(200).json({ success: true, data, meta }),
  created: (res, data) => res.status(201).json({ success: true, data }),
  badRequest: (res, message) => res.status(400).json({ success: false, message }),
  unauthorized: (res, message = 'Unauthorized') => res.status(401).json({ success: false, message }),
  forbidden: (res, message = 'Forbidden') => res.status(403).json({ success: false, message }),
  serverError: (res, message = 'Internal Server Error') => res.status(500).json({ success: false, message })
};
