import { SandboxManager } from '../sandbox';
import { IExecutor, ExecutionResult } from '../types';

export class NodeExecutor implements IExecutor {
  constructor(private manager: SandboxManager) {}

  async execute(code: string): Promise<ExecutionResult> {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const filename = `/tmp/exec_${uniqueId}.js`;
    await this.manager.uploadFile(filename, code);
    return await this.manager.executeCommand('node', [filename]);
  }
}
