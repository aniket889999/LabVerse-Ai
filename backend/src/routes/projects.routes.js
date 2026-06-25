import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.json({ message: `${name} route is working` });
});
export default router;
//# sourceMappingURL=projects.routes.js.map