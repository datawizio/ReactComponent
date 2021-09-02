const mockTags = ["cat", "dog", "bird"];

export const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 4 === 0,
    tag: mockTags[i % 3]
  });
}

export const originTargetKeys = mockData
  .filter(item => +item.key % 3 > 1)
  .map(item => item.key);

export const tableColumns = [
  {
    dataIndex: "title",
    title: "Name"
  },
  {
    dataIndex: "tag",
    title: "Tag",
    render: tag => tag
  },
  {
    dataIndex: "description",
    title: "Description",
    filters: [{ text: "test", value: "test" }]
  }
];
