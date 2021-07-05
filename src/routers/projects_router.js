const express = require('express');
const ProjectsController = require('../controllers/projects_controller');
const auth = require('../middleware/auth');
const projectCheck = require('../middleware/projectCheck');

const router = express.Router();

router.post('/projects', auth, ProjectsController.postProject);

router.patch('/projects/:projectId', [auth, projectCheck], ProjectsController.updateProject);

router.patch('/projects/add/:projectId', [auth, projectCheck], ProjectsController.addMember);

router.patch('/projects/remove/:projectId', [auth, projectCheck], ProjectsController.removeMember);

router.delete('/projects/:projectId', [auth, projectCheck], ProjectsController.deleteProject);

router.get('/projects/:projectId', auth, ProjectsController.getProject);

router.get('/projects/filesnames/:projectId', auth, ProjectsController.getAllFilesNames);

router.get('/projects', auth, ProjectsController.getProjects);


module.exports = router;