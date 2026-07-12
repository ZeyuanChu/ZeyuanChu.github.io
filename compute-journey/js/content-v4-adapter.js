/* 算力之旅 V4 · 兼容适配器
 * 将 canonical 内容库映射到现有 10 站数据壳，保持所有旧 Hash 路由、舞台热区与进度键不变。
 */
(function () {
  "use strict";

  const DATA = window.DATA;
  const V4 = window.CONTENT_V4;
  if (!DATA || !V4) return;

  function stationById(id) {
    return DATA.stations.find(station => station.id === id) || null;
  }

  function nodeAtPath(station, path) {
    if (!station || !path || !path.length) return null;
    let nodes;
    let ids = path.slice();
    if (ids[0] === "adv") {
      ids = ids.slice(1);
      if (!ids.length) return station.advanced || null;
      nodes = station.advanced && station.advanced.nodes;
    } else {
      nodes = station.nodes;
    }
    let node = null;
    for (const id of ids) {
      if (!nodes) return null;
      node = nodes.find(item => item.id === id) || null;
      if (!node) return null;
      nodes = node.children;
    }
    return node;
  }

  DATA.v4 = V4;
  DATA.meta.contentVersion = V4.meta.version;
  DATA.meta.contentAsOf = V4.meta.contentAsOf;

  Object.keys(V4.stationProfiles || {}).forEach(stationId => {
    const station = stationById(stationId);
    const profile = V4.stationProfiles[stationId];
    if (!station || !profile) return;
    station.contentV4 = profile;
    if (profile.tldr) station.tldr = profile.tldr;
    if (profile.intro) station.intro = profile.intro;
    if (V4.assessments && V4.assessments[stationId]) {
      station.quiz = V4.assessments[stationId].map(question => ({
        q: question.question,
        options: question.options.slice(),
        answer: question.answer,
        explain: question.explanation,
        kind: question.kind
      }));
    }
  });

  Object.keys(V4.legacyPlacements || {}).forEach(placementId => {
    const placement = V4.legacyPlacements[placementId];
    if (!placement || placement.kind !== "concept") return;
    const station = stationById(placement.stationId);
    const node = nodeAtPath(station, placement.legacyPath);
    const concept = V4.concepts[placement.conceptId];
    if (!node || !concept) return;
    node.contentRef = concept.id;
    node.tags = Array.from(new Set([].concat(node.tags || [], concept.tags || [], concept.aliases || [])));
    if (placement.presentation) {
      if (placement.presentation.title) node.name = placement.presentation.title;
      if (placement.presentation.en) node.en = placement.presentation.en;
      if (placement.presentation.brief) node.brief = placement.presentation.brief;
    }
  });
}());
