import { Router } from 'express';
import {

getPitches,
getPitchById,
createPitch,
updatePitch,
deletePitch,
} from '../controller/pitch.controller';

const router = Router();

router.get('/', getPitches);
router.get('/:id', getPitchById);
router.post('/', createPitch);
router.put('/:id', updatePitch);
router.delete('/:id', deletePitch);

export default router;