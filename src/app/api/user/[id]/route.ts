const { Sequelize, Model, DataTypes } = require('sequelize');

import User from '@/classes/User';

export async function GET (
    request: Request,
    { params }: { params: Promise<{ id: number}> }
) {
    const { id } = await params;
    const user : User = await User.fetch(id);
    return Response.json(user);
}