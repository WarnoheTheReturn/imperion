import { execFileSync } from 'child_process';
import path from 'path';

const packageJson = require('../../package.json') as {
    version: string;
};

export const getBotVersion = (): string => {
    try {
        const repositoryPath = path.resolve(__dirname, '../..');

        const commitCount = execFileSync(
            'git',
            ['rev-list', '--count', 'HEAD'],
            {
                cwd: repositoryPath,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore'],
            },
        ).trim();

        return `${packageJson.version}.${commitCount}`;
    } catch {
        return `${packageJson.version}.dev`;
    }
};