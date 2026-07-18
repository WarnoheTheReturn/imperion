const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'src', 'generated', 'version.ts');
const packageJsonPath = path.join(root, 'package.json');
const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8'),
);


try {
    const commitCount = execFileSync(
        'git',
        ['rev-list', '--count', 'HEAD'],
        {
            cwd: root,
            encoding: 'utf8',
        },
    ).trim();

    const shortSha = execFileSync(
        'git',
        ['rev-parse', '--short', 'HEAD'],
        {
            cwd: root,
            encoding: 'utf8',
        },
    ).trim();

    const baseVersion = packageJson.version;

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    fs.writeFileSync(
        outputPath,
        [
            '// DO NOT MODIFY THIS FILE',
            `export const BUILD_NUMBER = ${Number(commitCount)};`,
            `export const BUILD_SHA = '${shortSha}';`,
            `export const BOT_VERSION = '${baseVersion}.${Number(commitCount)}';`,
            '',
        ].join('\n'),
    );

    console.log(`Version uptaded : v${baseVersion}.${commitCount} (${shortSha})`);
} catch (error) {
    console.error('Impossible to generate version Git :', error.message);
    process.exit(1);
}