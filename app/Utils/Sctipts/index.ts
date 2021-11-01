import fs from 'fs';

export const stock = fs.readFileSync(__dirname + '/stock.lua', 'utf-8');
export const lock = fs.readFileSync(__dirname + '/lock.lua', 'utf-8');
export const unlock = fs.readFileSync(__dirname + '/unlock.lua', 'utf-8');