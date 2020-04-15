const fetch = require('node-fetch');
const config = require('config');
const Body = require('./lib/body');

const tocPostApi = `https://api.esa.io/v1/teams/${config.get('team')}/posts/${config.get('tocPostId')}`;

const fetchEsaPost = async url => {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.get('token')}`
      }
    });
    const res = await response.json();
    console.info(res);
    return res;
  } catch (error) {
    console.error(error);
  }
};

const patchEsaPost = async (url, post) => {
  try {
    const response = await fetch(url, {
      method: 'patch',
      body: JSON.stringify({post: post}),
      headers: {
        'Authorization': `Bearer ${config.get('token')}`,
        'Content-Type': 'application/json'
      }
    });
    const res = await response.json();
    console.info(res);
    return res;
  } catch (error) {
    console.error(error);
  }
}

exports.handler = async (event, context, callback) => {
  console.info(event);
  const webhookBody = JSON.parse(event['body']);
  const post = webhookBody['post'];
  const postUrl = post['url'];
  let postName = post['name'];

  let isFlow = false;
  const dateMatch = postName.match(/(.*)\/\d{4}.\d{1,2}.\d{1,2}/)
  if(dateMatch) {
    isFlow = true;
    postName = dateMatch[1];
  }
  if(postName.match(/\s#flow/)) {
    isFlow = true;
    postName = postName.replace(/\/[^\/]*$/, '')
  }
  // delete tags
  postName = postName.replace(/\s#[^\/]+$/, '')

  const tocPost = await fetchEsaPost(tocPostApi);
  const tocPostMarkdown = tocPost['body_md'];
  const body = new Body(config.get('tocDirectory'));
  body.parse(tocPostMarkdown);
  console.info('original toc post', '\n', tocPostMarkdown);

  if(isFlow) {
    body.setFlowLink(postName);
  } else {
    body.addPost(postName, postUrl);
  }
  const updated = body.compose();

  const patchPost = {
    name: tocPost.name,
    tags: tocPost.tags,
    category: tocPost.category,
    wip: false,
    message: 'update',
    body_md: updated
  }
  console.info('updated toc post', '\n', updated);

  await patchEsaPost(tocPostApi);

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'ok' }),
  };
  return callback(null, response);
};
