export async function createWorkspace(workspaceName: string, options: { global?: boolean }) {
    const fs = await import("fs/promises");
    const path = await import("path");
    const os = await import("os");
    const workspaceDir = options?.global
        ? path.resolve(os.homedir(), workspaceName)
        : path.resolve(process.cwd(), workspaceName);
    await fs.mkdir(workspaceDir, { recursive: true });

    // cd into the dir and run genos init
    process.chdir(workspaceDir);
    console.log(`Created workspace '${workspaceName}' at ${process.cwd()}`);
    console.log("Initializing workspace...");
    const { exec } = await import("child_process");
    exec("genos init", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error initializing workspace: ${error.message}`);
            return;
        }
        console.log("Workspace initialized successfully.");
    });
}