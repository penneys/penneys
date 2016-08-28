# Builds locally and pushes to the published website.

npm install
gulp

git clone --depth 1 git@github.com:penneys/penneys.github.io.git

cd penneys.github.io
git rm -rf *
cp -r ../dist/* .
git add .
git commit -am "Updated the website"
git push

cd ..
rm -rf penneys.github.io
