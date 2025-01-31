import { Request, Response } from 'express';
import Pitch from '../models/pitch.model';

// Create a new pitch
export const createPitch = async (req: Request, res: Response): Promise<void> => {
    try {
        const newPitch = new Pitch(req.body);
        const savedPitch = await newPitch.save();
        res.status(201).json(savedPitch);
    } catch (error) {
        res.status(500).json({ message: 'Error creating pitch', error });
    }
};

// Get all pitches
export const getPitches = async (req: Request, res: Response): Promise<void> => {
    try {
        const pitches = await Pitch.find();
        res.status(200).json(pitches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pitches', error });
    }
};

// Get a single pitch by ID
export const getPitchById = async (req: Request, res: Response): Promise<void> => {
    try {
        const pitch = await Pitch.findById(req.params.id);
        if (pitch) {
            res.status(200).json(pitch);
        } else {
            res.status(404).json({ message: 'Pitch not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pitch', error });
    }
};

// Update a pitch by ID
export const updatePitch = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedPitch = await Pitch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedPitch) {
            res.status(200).json(updatedPitch);
        } else {
            res.status(404).json({ message: 'Pitch not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating pitch', error });
    }
};

// Delete a pitch by ID
export const deletePitch = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedPitch = await Pitch.findByIdAndDelete(req.params.id);
        if (deletedPitch) {
            res.status(200).json({ message: 'Pitch deleted' });
        } else {
            res.status(404).json({ message: 'Pitch not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting pitch', error });
    }
};