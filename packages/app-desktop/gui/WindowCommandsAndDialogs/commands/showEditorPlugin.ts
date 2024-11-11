import { CommandContext, CommandDeclaration, CommandRuntime } from '@joplin/lib/services/CommandService';
import Setting from '@joplin/lib/models/Setting';
import getActivePluginEditorView from '@joplin/lib/services/plugins/utils/getActivePluginEditorView';
import Logger from '@joplin/utils/Logger';

const logger = Logger.create('showEditorPlugin');

export const declaration: CommandDeclaration = {
	name: 'showEditorPlugin',
	label: () => 'Show editor plugin',
	iconName: 'fas fa-eye',
};

export const runtime = (): CommandRuntime => {
	return {
		execute: async (context: CommandContext, editorViewId = '', show = true) => {
			logger.info('View:', editorViewId, 'Show:', show);

			const shownEditorViewIds = Setting.value('plugins.shownEditorViewIds');

			if (!editorViewId) {
				const { editorPlugin, editorView } = getActivePluginEditorView(context.state.pluginService.plugins);

				if (!editorPlugin) {
					logger.warn('No editor plugin to toggle to');
					return;
				}

				editorViewId = editorView.id;
			}

			const idx = shownEditorViewIds.indexOf(editorViewId);

			if (show) {
				if (idx >= 0) {
					logger.info(`Editor is already visible: ${editorViewId}`);
					return;
				}

				shownEditorViewIds.push(editorViewId);
			} else {
				if (idx < 0) {
					logger.info(`Editor is already hidden: ${editorViewId}`);
					return;
				}

				shownEditorViewIds.splice(idx, 1);
			}

			Setting.setValue('plugins.shownEditorViewIds', shownEditorViewIds);
		},
	};
};
