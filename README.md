# BorrowYours

BorrowYours Web App

TODO: paths for uploads
The best way to do this would be app.use('/uploads', express.static(path.join(\_\_dirname, '..', 'uploads')));
You want to use the path module because it Windows uses backslashes but other OS use forward slashes. The path module handles the correct slashes for you if you use the snippet I provided.
