export const navigateToStory = (folder: string, storyId: string) =>
  `./iframe.html?args=&id=tests-integration-${folder}--${storyId}&viewMode=story`;

export const navigateToTest = (storyId: string) =>
  `./iframe.html?args=&id=${storyId}&viewMode=story`;
